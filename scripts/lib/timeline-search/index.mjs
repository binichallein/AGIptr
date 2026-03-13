import fs from "node:fs/promises";
import path from "node:path";

import { loadTimelineVendorConfig } from "./config.mjs";
import {
  extractEvidenceFromSearchDocument,
  extractFallbackDateEvidenceFromHtml,
  isLikelyExactModelPage
} from "./extractor.mjs";
import { canFetchTimelineUrl, fetchTimelineDocument } from "./fetcher.mjs";
import { normalizeEvidenceToTimelineCandidates } from "./normalizer.mjs";
import { buildExactModelFollowUpQueries, buildTimelineQueryPlan } from "./planner.mjs";
import { diffTimelineCandidatesAgainstCanonical, renderTimelineDiffReport } from "./reporter.mjs";
import { extractWithTavily, searchWithTavily } from "./tavily-client.mjs";

async function ensureDir(filePath) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
}

function parseArgs(args = []) {
  const options = {
    vendor: "",
    date: new Date().toISOString().slice(0, 10),
    mode: "candidates"
  };

  for (const argument of args) {
    if (argument.startsWith("--vendor=")) {
      options.vendor = argument.slice("--vendor=".length);
    } else if (argument.startsWith("--date=")) {
      options.date = argument.slice("--date=".length);
    } else if (argument.startsWith("--mode=")) {
      options.mode = argument.slice("--mode=".length);
    }
  }

  return options;
}

async function loadCanonicalDataset(repoRoot) {
  const canonicalPath = path.join(repoRoot, "data/canonical/site-data.json");
  return JSON.parse(await fs.readFile(canonicalPath, "utf8"));
}

function buildOutputPaths(repoRoot, runDate, vendorIds) {
  return {
    candidates: Object.fromEntries(
      vendorIds.map((vendorId) => [
        vendorId,
        path.join(repoRoot, `data/candidates/timelines/${runDate}/${vendorId}.json`)
      ])
    ),
    report: path.join(repoRoot, `logs/reports/${runDate}-timeline-search.md`),
    verification: path.join(repoRoot, `logs/verification/${runDate}-timeline-search.jsonl`)
  };
}

function buildKnownModelNames(canonicalDataset, vendorId) {
  return (canonicalDataset?.models || [])
    .filter((model) => model.vendorId === vendorId)
    .map((model) => model.name);
}

function normalizeSearchResult(result) {
  const sourceUrl = result.url || "";
  return {
    ...result,
    source_domain: result.source_domain || (sourceUrl ? new URL(sourceUrl).hostname : "")
  };
}

function buildExtractQuery({ result, modelNames = [] }) {
  const title = String(result?.title || "").trim();
  if (title) {
    return `${title} release date announcement`;
  }

  const dedupedModelNames = [...new Set(modelNames.filter(Boolean))];
  if (!dedupedModelNames.length) {
    return "";
  }

  return `${dedupedModelNames.join(", ")} release date`;
}

async function collectVendorEvidence({
  vendorId,
  vendorConfig,
  canonicalDataset,
  apiKey,
  searchClient = searchWithTavily,
  extractClient = extractWithTavily,
  fetchImpl = fetch,
  verificationEvents,
  runTimestamp
}) {
  const plan = buildTimelineQueryPlan({
    ...vendorConfig,
    id: vendorId
  });
  const resultsByUrl = new Map();
  const knownModelNames = buildKnownModelNames(canonicalDataset, vendorId);

  async function executeQueries(queries = []) {
    for (const query of queries) {
      verificationEvents.push({
        event_type: "search_query",
        vendor_id: vendorId,
        model_id: "",
        field: query.intent,
        old_value: "",
        new_value: query.q,
        source_url: "",
        confidence: "",
        decision_reason: "planned vendor query",
        actor: "timeline-search",
        timestamp: runTimestamp
      });

      const results = await searchClient({
        apiKey,
        query: query.q,
        includeDomains: vendorConfig.officialDomains,
        excludeDomains: vendorConfig.excludedDomains || []
      });

      for (const rawResult of results) {
        const result = normalizeSearchResult(rawResult);
        if (!canFetchTimelineUrl(result.url, vendorConfig.officialDomains)) {
          continue;
        }
        if (!result.raw_content) {
          result.raw_content = await fetchTimelineDocument({
            url: result.url,
            officialDomains: vendorConfig.officialDomains,
            fetchImpl
          });
        }
        resultsByUrl.set(result.url, result);
        verificationEvents.push({
          event_type: "search_result",
          vendor_id: vendorId,
          model_id: "",
          field: query.intent,
          old_value: "",
          new_value: result.title || result.url,
          source_url: result.url,
          confidence: "primary",
          decision_reason: "official-domain search hit",
          actor: "timeline-search",
          timestamp: runTimestamp
        });
      }
    }
  }

  function collectEvidenceFromResults() {
    const evidence = [];

    for (const result of resultsByUrl.values()) {
      const resultEvidence = extractEvidenceFromSearchDocument({
        vendorId,
        result,
        knownModelNames
      });
      const modelNames = [...new Set(
        resultEvidence
          .filter((item) => item.fact_type === "model_name")
          .map((item) => item.model_name_raw || item.fact_value)
          .filter(Boolean)
      )];
      const fallbackHtmlPromise = fetchTimelineDocument({
        url: result.url,
        officialDomains: vendorConfig.officialDomains,
        fetchImpl
      });
      const extractPromise = modelNames.length && isLikelyExactModelPage({ result, modelNames })
        ? extractClient({
            apiKey,
            urls: [result.url],
            query: buildExtractQuery({
              result,
              modelNames
            })
          }).catch(() => [])
        : Promise.resolve([]);
      evidence.push(
        Promise.all([fallbackHtmlPromise, extractPromise]).then(([fallbackHtml, extractedResults]) => {
          const extractedContent = (extractedResults || [])
            .map((item) => item.raw_content || "")
            .filter(Boolean)
            .join("\n");
          return [
            ...resultEvidence,
            ...extractFallbackDateEvidenceFromHtml({
              vendorId,
              result,
              existingEvidence: resultEvidence,
              html: extractedContent,
              sourceType: "tavily-extract"
            }),
            ...extractFallbackDateEvidenceFromHtml({
              vendorId,
              result,
              existingEvidence: resultEvidence,
              html: fallbackHtml || "",
              sourceType: "html-fallback"
            })
          ];
        })
      );
    }

    return Promise.all(evidence).then((chunks) => chunks.flatMap((chunk) => chunk));
  }

  await executeQueries(plan.queries);

  let evidence = await collectEvidenceFromResults();
  const followUpQueries = buildExactModelFollowUpQueries({
    vendorId,
    officialDomains: vendorConfig.officialDomains,
    unresolvedModelNames: collectFollowUpModelNames(evidence, knownModelNames),
    followUpBudget: vendorConfig.followUpBudget || 0
  });

  if (followUpQueries.length) {
    await executeQueries(followUpQueries);
    evidence = await collectEvidenceFromResults();
  }

  return evidence;
}

function hasExactPageEvidence(modelName, items = []) {
  return items.some((item) =>
    isLikelyExactModelPage({
      result: {
        title: item.source_title || "",
        url: item.source_url || ""
      },
      modelNames: [modelName]
    })
  );
}

function collectFollowUpModelNames(evidenceItems = [], knownModelNames = []) {
  const grouped = new Map();
  const knownModelNameSet = new Set((knownModelNames || []).map((modelName) => String(modelName).toLowerCase()));

  for (const item of evidenceItems) {
    const modelName = item.model_name_raw || item.fact_value;
    if (!modelName || !/\d/.test(modelName)) continue;
    const key = modelName.toLowerCase();
    const current = grouped.get(key) || {
      modelName,
      firstSeen: grouped.size,
      items: []
    };
    current.items.push(item);
    grouped.set(key, current);
  }

  return [...grouped.values()]
    .map(({ modelName, firstSeen, items }) => {
      const releaseDates = new Set(
        items
          .filter((item) => item.fact_type === "release_date" && item.fact_value)
          .map((item) => item.fact_value)
      );
      const hasConflict = releaseDates.size > 1;
      const hasReleaseDate = releaseDates.size > 0;
      const exactPage = hasExactPageEvidence(modelName, items);
      const knownModel = knownModelNameSet.has(modelName.toLowerCase());

      return {
        modelName,
        firstSeen,
        score:
          (hasConflict ? 100 : 0) +
          (!exactPage ? 50 : 0) +
          (!hasReleaseDate ? 20 : 0) +
          (knownModel ? 10 : 0)
      };
    })
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }
      return left.firstSeen - right.firstSeen;
    })
    .map((item) => item.modelName);
}

export async function buildTimelineSearchRunContext({ repoRoot, args = [], env = process.env }) {
  const options = parseArgs(args);
  const apiKey = env.TAVILY_API_KEY || "";
  if (!apiKey) {
    throw new Error("TAVILY_API_KEY is required");
  }

  const config = await loadTimelineVendorConfig(repoRoot);
  const availableVendorIds = Object.keys(config.vendors).sort();
  const vendorIds = options.vendor ? [options.vendor] : availableVendorIds;

  return {
    apiKey,
    config,
    mode: options.mode,
    runDate: options.date,
    vendorIds,
    outputPaths: buildOutputPaths(repoRoot, options.date, vendorIds)
  };
}

export async function writeTimelineSearchOutputs({
  repoRoot,
  runDate,
  vendorCandidates,
  vendorDiffs,
  verificationEvents
}) {
  const vendorIds = Object.keys(vendorCandidates);
  const outputPaths = buildOutputPaths(repoRoot, runDate, vendorIds);

  for (const [vendorId, filePath] of Object.entries(outputPaths.candidates)) {
    await ensureDir(filePath);
    await fs.writeFile(
      filePath,
      `${JSON.stringify({ vendorId, runDate, candidates: vendorCandidates[vendorId] }, null, 2)}\n`,
      "utf8"
    );
  }

  await ensureDir(outputPaths.report);
  await fs.writeFile(
    outputPaths.report,
    renderTimelineDiffReport({
      runDate,
      vendorDiffs
    }),
    "utf8"
  );

  await ensureDir(outputPaths.verification);
  const jsonLines = verificationEvents.map((event) => JSON.stringify(event)).join("\n");
  await fs.writeFile(outputPaths.verification, `${jsonLines}\n`, "utf8");
}

export async function runTimelineSearch({
  repoRoot,
  args = [],
  env = process.env,
  searchClient = searchWithTavily,
  extractClient = extractWithTavily,
  fetchImpl = fetch
}) {
  const context = await buildTimelineSearchRunContext({ repoRoot, args, env });
  const canonicalDataset = await loadCanonicalDataset(repoRoot);
  const verificationEvents = [];
  const runTimestamp = new Date().toISOString();
  const vendorCandidates = {};
  const vendorDiffs = [];

  for (const vendorId of context.vendorIds) {
    const vendorConfig = context.config.vendors[vendorId];
    const evidence = await collectVendorEvidence({
      vendorId,
      vendorConfig,
      canonicalDataset,
      apiKey: context.apiKey,
      searchClient,
      extractClient,
      fetchImpl,
      verificationEvents,
      runTimestamp
    });
    const candidates = normalizeEvidenceToTimelineCandidates({
      vendorId,
      officialDomains: vendorConfig.officialDomains,
      evidenceItems: evidence
    });
    const diff = diffTimelineCandidatesAgainstCanonical({
      vendorId,
      candidates,
      canonicalDataset
    });

    vendorCandidates[vendorId] = candidates;
    vendorDiffs.push(diff);

    for (const candidate of candidates) {
      verificationEvents.push({
        event_type: candidate.conflict_flags.length ? "candidate_conflict" : "candidate_model",
        vendor_id: vendorId,
        model_id: candidate.model_id_candidate,
        field: "candidate",
        old_value: "",
        new_value: candidate.release_date_candidate,
        source_url: "",
        confidence: candidate.confidence,
        decision_reason: candidate.conflict_flags.join(", ") || "candidate derived from official evidence",
        actor: "timeline-search",
        timestamp: runTimestamp
      });
    }
  }

  await writeTimelineSearchOutputs({
    repoRoot,
    runDate: context.runDate,
    vendorCandidates,
    vendorDiffs,
    verificationEvents
  });

  return {
    context,
    vendorCandidates,
    vendorDiffs,
    verificationEvents
  };
}
