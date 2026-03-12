const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

const MODEL_PATTERNS = {
  openai: [
    /\bGPT-(?:\d(?:\.\d)?|4o|5(?:\.\d+)?)(?:\s(?:mini|turbo|preview|nano))?\b/gi,
    /\bo(?:1|3|4)(?:-mini|-preview)?\b/gi
  ],
  anthropic: [
    /\bClaude\s\d(?:\.\d)?\s(?:Opus|Sonnet|Haiku)\b/gi,
    /\bClaude\s(?:Opus|Sonnet|Haiku)\s\d(?:\.\d)?\b/gi,
    /\bClaude\s(?:4(?:\.\d)?|3(?:\.\d)?|2(?:\.\d)?)\b/gi
  ],
  "google-deepmind": [
    /\bGemini\s\d(?:\.\d)?\s(?:Flash|Pro|Ultra|Nano|Thinking)\b/gi,
    /\bGemini\s\d(?:\.\d)?\b/gi
  ]
};

const ANNOUNCEMENT_KEYWORDS = ["introducing", "hello", "announce", "announcing", "launch", "released", "release"];
const DOWNRANK_KEYWORDS = [
  "retiring",
  "older-models",
  "deprecations",
  "deprecation",
  "changelog",
  "updates",
  "state-of-the-art",
  "security",
  "newsroom"
];
const VARIANT_FOLLOWUPS = ["mini", "turbo", "preview", "flash", "opus", "sonnet", "haiku", "thinking", "pro", "ultra", "nano"];

function safeHostname(value) {
  try {
    return new URL(value).hostname;
  } catch {
    return "";
  }
}

export function toIsoDate(value) {
  const directMatch = String(value || "").match(/\b(20\d{2}-\d{2}-\d{2})(?:T|\b)/);
  if (directMatch) return directMatch[1];

  const monthPattern = new RegExp(
    `\\b(${MONTH_NAMES.join("|")})\\s+(\\d{1,2}),\\s+(20\\d{2})\\b`,
    "i"
  );
  const monthMatch = String(value || "").match(monthPattern);
  if (!monthMatch) return "";

  const month = MONTH_NAMES.findIndex((name) => name.toLowerCase() === monthMatch[1].toLowerCase()) + 1;
  const day = monthMatch[2].padStart(2, "0");
  return `${monthMatch[3]}-${String(month).padStart(2, "0")}-${day}`;
}

function collectDateCandidates(value) {
  const text = String(value || "");
  const candidates = [];

  for (const match of text.matchAll(/\b(20\d{2}-\d{2}-\d{2})(?:T|\b)/g)) {
    candidates.push({
      date: match[1],
      index: match.index ?? 0
    });
  }

  const monthPattern = new RegExp(`\\b(${MONTH_NAMES.join("|")})\\s+(\\d{1,2}),\\s+(20\\d{2})\\b`, "gi");
  for (const match of text.matchAll(monthPattern)) {
    const month = MONTH_NAMES.findIndex((name) => name.toLowerCase() === match[1].toLowerCase()) + 1;
    candidates.push({
      date: `${match[3]}-${String(month).padStart(2, "0")}-${match[2].padStart(2, "0")}`,
      index: match.index ?? 0
    });
  }

  return candidates.sort((left, right) => left.index - right.index);
}

function findBestDateNearAnchors(value, anchors = []) {
  const candidates = collectDateCandidates(value);
  if (!candidates.length) {
    return "";
  }

  const text = String(value || "").toLowerCase();
  const anchorPositions = (anchors || [])
    .map((anchor) => String(anchor || "").trim().toLowerCase())
    .filter(Boolean)
    .map((anchor) => text.indexOf(anchor))
    .filter((index) => index >= 0);

  if (!anchorPositions.length) {
    return candidates[0].date;
  }

  return candidates
    .map((candidate) => ({
      ...candidate,
      distance: Math.min(...anchorPositions.map((anchorIndex) => Math.abs(candidate.index - anchorIndex)))
    }))
    .sort((left, right) => {
      if (left.distance !== right.distance) {
        return left.distance - right.distance;
      }
      return left.index - right.index;
    })[0].date;
}

function normalizeModelName(value) {
  return String(value || "")
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\bgpt\b/gi, "GPT")
    .replace(/\bclaude\b/gi, "Claude")
    .replace(/\bgemini\b/gi, "Gemini")
    .replace(/\bMini\b/g, "mini")
    .replace(/\bTurbo\b/g, "turbo")
    .replace(/\bPreview\b/g, "Preview")
    .replace(/\bFlash\b/g, "Flash")
    .replace(/\bPro\b/g, "Pro")
    .replace(/\bUltra\b/g, "Ultra")
    .replace(/\bThinking\b/g, "Thinking")
    .replace(/\bO([134])\b/g, "o$1");
}

function collectRegexMatches(vendorId, text, knownMap) {
  const matches = new Map();
  for (const pattern of MODEL_PATTERNS[vendorId] || []) {
    for (const match of text.matchAll(pattern)) {
      const normalized = normalizeModelName(match[0]);
      const canonical = knownMap.get(normalized.toLowerCase()) || normalized;
      matches.set(canonical.toLowerCase(), canonical);
    }
  }
  return [...matches.values()];
}

function buildSnippet(text, modelName) {
  const lower = text.toLowerCase();
  const needle = modelName.toLowerCase();
  const index = lower.indexOf(needle);
  if (index < 0) return modelName;
  const start = Math.max(0, index - 40);
  const end = Math.min(text.length, index + modelName.length + 40);
  return text.slice(start, end).replace(/\s+/g, " ").trim();
}

function escapeRegex(value) {
  return String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function slugifyModelName(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getTitleAndUrl(result) {
  return [result?.title, result?.url].filter(Boolean).join("\n");
}

function hasUrlModelSlugMatch(url, modelName) {
  const slug = slugifyModelName(modelName);
  const pattern = new RegExp(
    `(^|[^a-z0-9])${escapeRegex(slug)}(?!-\\d|-(?:${VARIANT_FOLLOWUPS.join("|")}))([^a-z0-9]|$)`,
    "i"
  );
  return pattern.test(String(url || "").toLowerCase());
}

function hasExactModelMatch(text, modelName) {
  const pattern = new RegExp(
    `(^|[^a-z0-9])${escapeRegex(modelName.toLowerCase())}(?![.-]?\\d|(?:\\s|-)(?:${VARIANT_FOLLOWUPS.join("|")}))([^a-z0-9]|$)`,
    "i"
  );
  return pattern.test(String(text || "").toLowerCase());
}

function collectKnownModelMatches(text, knownMap) {
  return [...knownMap.values()].filter((modelName) => hasExactModelMatch(text, modelName));
}

function collectUrlKnownModelMatches(url, knownMap) {
  return [...knownMap.values()].filter((modelName) => hasUrlModelSlugMatch(url, modelName));
}

function isListingPage(result) {
  const url = String(result?.url || "").toLowerCase();
  return [
    /\/news(?:$|\?)/,
    /\/products\/gemini\/?(?:$|\?)/,
    /\/docs\/(?:models|changelog|deprecations)(?:$|\?)/,
    /\/workspace\//,
    /\/google-ai-updates-/,
    /\/bett-/,
    /\?/
  ].some((pattern) => pattern.test(url));
}

function collectModelNames({ vendorId, result, knownMap }) {
  const text = [result.title, result.content, result.raw_content].filter(Boolean).join("\n");
  const titleModels = [
    ...new Set([
      ...collectRegexMatches(vendorId, result.title || "", knownMap),
      ...collectKnownModelMatches(result.title || "", knownMap),
      ...collectUrlKnownModelMatches(result.url || "", knownMap)
    ])
  ];

  if (titleModels.length && !isListingPage(result)) {
    return titleModels;
  }

  return [
    ...new Set([
      ...titleModels,
      ...collectRegexMatches(vendorId, text, knownMap),
      ...collectKnownModelMatches(text, knownMap)
    ])
  ];
}

function getTitleMatchedModels(modelNames, result) {
  return new Set(
    modelNames.filter((modelName) => hasExactModelMatch(result.title || "", modelName) || hasUrlModelSlugMatch(result.url || "", modelName))
  );
}

function computeReleaseDateScore({ modelName, sourceUrl, sourceTitle }) {
  const url = String(sourceUrl || "").toLowerCase();
  const title = String(sourceTitle || "").toLowerCase();
  const lowerModel = String(modelName || "").toLowerCase();
  const modelSlug = slugifyModelName(modelName);
  let score = 0;

  if (url.includes(modelSlug)) score += 4;
  if (hasExactModelMatch(title, modelName)) score += 3;
  if (title.startsWith(lowerModel)) score += 2;
  if (ANNOUNCEMENT_KEYWORDS.some((keyword) => title.includes(keyword) || url.includes(keyword))) score += 4;
  if (DOWNRANK_KEYWORDS.some((keyword) => title.includes(keyword) || url.includes(keyword))) score -= 4;

  return score;
}

function createModelNameEvidence({ vendorId, sourceUrl, sourceDomain, sourceType, observedAt, modelName, text, sourceTitle, index }) {
  return {
    evidence_id: `${vendorId}-${sourceUrl}-${index}-name`,
    vendor_id: vendorId,
    source_url: sourceUrl,
    source_domain: sourceDomain,
    source_type: sourceType,
    officiality: "primary",
    observed_at: observedAt || "",
    fact_type: "model_name",
    fact_value: modelName,
    model_name_raw: modelName,
    quote_snippet: buildSnippet(text, modelName),
    confidence: "primary",
    extraction_reason: "model name matched known vendor pattern",
    source_title: sourceTitle || ""
  };
}

function createReleaseDateEvidence({
  vendorId,
  sourceUrl,
  sourceDomain,
  sourceType,
  observedAt,
  modelName,
  text,
  sourceTitle,
  index,
  extractionReason
}) {
  return {
    evidence_id: `${vendorId}-${sourceUrl}-${index}-date`,
    vendor_id: vendorId,
    source_url: sourceUrl,
    source_domain: sourceDomain,
    source_type: sourceType,
    officiality: "primary",
    observed_at: observedAt,
    fact_type: "release_date",
    fact_value: observedAt,
    model_name_raw: modelName,
    quote_snippet: buildSnippet(text || sourceTitle || modelName, modelName),
    confidence: "primary",
    extraction_reason: extractionReason,
    source_title: sourceTitle || "",
    release_date_score:
      computeReleaseDateScore({ modelName, sourceUrl, sourceTitle }) +
      (sourceType === "html-fallback" ? 2 : 0) +
      (sourceType === "tavily-extract" ? 4 : 0)
  };
}

export function extractFallbackDateEvidenceFromHtml({
  vendorId,
  result,
  existingEvidence = [],
  html = "",
  sourceType = "html-fallback"
}) {
  const sourceUrl = result.url || "";
  const sourceDomain = result.source_domain || safeHostname(sourceUrl);
  const modelNames = [...new Set(
    (existingEvidence || [])
      .filter((item) => item.fact_type === "model_name")
      .map((item) => item.model_name_raw || item.fact_value)
      .filter(Boolean)
  )];
  const publishedAt = findBestDateNearAnchors(html, [
    String(result.title || "").replace(/\s+-\s+[^-]+$/, ""),
    ...modelNames
  ]);
  if (!publishedAt) {
    return [];
  }
  const titleMatchedModels = getTitleMatchedModels(modelNames, result);
  let evidenceIndex = (existingEvidence || []).length;

  return modelNames
    .filter((modelName) => titleMatchedModels.has(modelName))
    .map((modelName) => {
      evidenceIndex += 1;
      return createReleaseDateEvidence({
        vendorId,
        sourceUrl,
        sourceDomain,
        sourceType,
        observedAt: publishedAt,
        modelName,
        text: html,
        sourceTitle: result.title || "",
        index: evidenceIndex,
        extractionReason:
          sourceType === "tavily-extract"
            ? "published date recovered from Tavily extract for title-matched model"
            : "published date recovered from fallback HTML for title-matched model"
      });
    });
}

export function extractEvidenceFromSearchDocument({
  vendorId,
  result,
  knownModelNames = []
}) {
  const sourceUrl = result.url || "";
  const sourceDomain = result.source_domain || safeHostname(sourceUrl);
  const text = [result.title, result.content, result.raw_content].filter(Boolean).join("\n");
  const knownMap = new Map((knownModelNames || []).map((modelName) => [modelName.toLowerCase(), modelName]));
  const modelNames = collectModelNames({ vendorId, result, knownMap });
  const publishedAt =
    toIsoDate(result.published_date || result.publishedDate) ||
    findBestDateNearAnchors(text, [String(result.title || "").replace(/\s+-\s+[^-]+$/, ""), ...modelNames]);
  const titleMatchedModels = getTitleMatchedModels(modelNames, result);

  let evidenceIndex = 0;
  const evidence = [];

  for (const modelName of modelNames) {
    evidenceIndex += 1;
    evidence.push(
      createModelNameEvidence({
        vendorId,
        sourceUrl,
        sourceDomain,
        sourceType: "search-result",
        observedAt: publishedAt,
        modelName,
        text,
        sourceTitle: result.title || "",
        index: evidenceIndex
      })
    );

    if (publishedAt && titleMatchedModels.has(modelName)) {
      evidenceIndex += 1;
      evidence.push(
        createReleaseDateEvidence({
          vendorId,
          sourceUrl,
          sourceDomain,
          sourceType: "search-result",
          observedAt: publishedAt,
          modelName,
          text,
          sourceTitle: result.title || "",
          index: evidenceIndex,
          extractionReason: "published date inferred from result metadata or page text"
        })
      );
    }
  }

  return evidence;
}
