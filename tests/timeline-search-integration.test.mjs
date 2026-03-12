import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { runTimelineSearch, writeTimelineSearchOutputs } from "../scripts/lib/timeline-search/index.mjs";

test("writeTimelineSearchOutputs writes candidate JSON, report markdown, and JSONL verification logs", async () => {
  const repoRoot = await fs.mkdtemp(path.join(os.tmpdir(), "agiptr-timeline-"));
  await fs.mkdir(path.join(repoRoot, "data/candidates/timelines/2026-03-12"), { recursive: true });
  await fs.mkdir(path.join(repoRoot, "logs/reports"), { recursive: true });
  await fs.mkdir(path.join(repoRoot, "logs/verification"), { recursive: true });

  await writeTimelineSearchOutputs({
    repoRoot,
    runDate: "2026-03-12",
    vendorCandidates: {
      openai: [
        {
          model_name: "GPT-5.4",
          model_id_candidate: "openai/GPT-5.4",
          release_date_candidate: "2026-03-05",
          latest_candidate: true,
          supporting_evidence_ids: ["e1"],
          conflict_flags: []
        }
      ]
    },
    vendorDiffs: [
      {
        vendorId: "openai",
        added: [
          {
            model_name: "GPT-5.4",
            model_id_candidate: "openai/GPT-5.4"
          }
        ],
        releaseDateChanges: [],
        latestModelChange: null,
        conflicts: []
      }
    ],
    verificationEvents: [
      {
        event_type: "search_result",
        vendor_id: "openai",
        model_id: "",
        field: "candidate",
        old_value: "",
        new_value: "openai/GPT-5.4",
        source_url: "https://openai.com/index/introducing-gpt-5-4/",
        confidence: "primary",
        decision_reason: "official result",
        actor: "timeline-search",
        timestamp: "2026-03-12T00:00:00.000Z"
      }
    ]
  });

  const candidate = JSON.parse(
    await fs.readFile(path.join(repoRoot, "data/candidates/timelines/2026-03-12/openai.json"), "utf8")
  );
  const report = await fs.readFile(path.join(repoRoot, "logs/reports/2026-03-12-timeline-search.md"), "utf8");
  const verification = await fs.readFile(
    path.join(repoRoot, "logs/verification/2026-03-12-timeline-search.jsonl"),
    "utf8"
  );

  assert.equal(candidate.vendorId, "openai");
  assert.equal(candidate.candidates[0].model_name, "GPT-5.4");
  assert.match(report, /openai/i);
  assert.match(verification, /openai\/GPT-5\.4/);
});

test("runTimelineSearch fetches HTML fallback when result raw content lacks a release date", async () => {
  const repoRoot = await fs.mkdtemp(path.join(os.tmpdir(), "agiptr-timeline-run-"));
  await fs.mkdir(path.join(repoRoot, "config/search-agents"), { recursive: true });
  await fs.mkdir(path.join(repoRoot, "data/canonical"), { recursive: true });

  await fs.writeFile(
    path.join(repoRoot, "config/search-agents/timeline-vendors.json"),
    JSON.stringify(
      {
        schemaVersion: 1,
        vendors: {
          anthropic: {
            displayName: "Anthropic",
            officialDomains: ["www.anthropic.com"],
            families: ["Claude"],
            variants: ["sonnet"],
            queryBudget: 1,
            queryTemplates: {
              discover: ["site:anthropic.com {family} announcement"],
              supplement: [],
              verify: []
            }
          }
        }
      },
      null,
      2
    ),
    "utf8"
  );

  await fs.writeFile(
    path.join(repoRoot, "data/canonical/site-data.json"),
    JSON.stringify(
      {
        vendors: [{ id: "anthropic" }],
        models: [
          {
            id: "anthropic/Claude 3.7 Sonnet",
            vendorId: "anthropic",
            name: "Claude 3.7 Sonnet",
            releaseDate: "2025-02-24",
            isPrimary: true,
            isLatestPrimary: true
          }
        ]
      },
      null,
      2
    ),
    "utf8"
  );

  const result = await runTimelineSearch({
    repoRoot,
    args: ["--vendor=anthropic", "--date=2026-03-12"],
    env: { TAVILY_API_KEY: "test-key" },
    extractClient: async () => [],
    searchClient: async () => [
      {
        url: "https://www.anthropic.com/news/claude-sonnet-4-6",
        title: "Claude Sonnet 4.6",
        content: "Claude Sonnet 4.6 is our latest model.",
        raw_content: "Claude Sonnet 4.6 is our latest model.",
        published_date: ""
      }
    ],
    fetchImpl: async () => ({
      ok: true,
      async text() {
        return '<meta property="article:published_time" content="2026-02-17T00:00:00Z">Claude Sonnet 4.6';
      }
    })
  });

  assert.equal(result.vendorCandidates.anthropic[0].release_date_candidate, "2026-02-17");
});

test("runTimelineSearch follows up unresolved official model mentions with exact model queries", async () => {
  const repoRoot = await fs.mkdtemp(path.join(os.tmpdir(), "agiptr-timeline-followup-"));
  await fs.mkdir(path.join(repoRoot, "config/search-agents"), { recursive: true });
  await fs.mkdir(path.join(repoRoot, "data/canonical"), { recursive: true });

  await fs.writeFile(
    path.join(repoRoot, "config/search-agents/timeline-vendors.json"),
    JSON.stringify(
      {
        schemaVersion: 1,
        vendors: {
          anthropic: {
            displayName: "Anthropic",
            officialDomains: ["www.anthropic.com"],
            families: ["Claude"],
            variants: ["sonnet"],
            queryBudget: 3,
            followUpBudget: 2,
            queryTemplates: {
              discover: ["site:anthropic.com {family} announcement"],
              supplement: ["site:anthropic.com {family} {variant} announcement"],
              verify: []
            }
          }
        }
      },
      null,
      2
    ),
    "utf8"
  );

  await fs.writeFile(
    path.join(repoRoot, "data/canonical/site-data.json"),
    JSON.stringify(
      {
        vendors: [{ id: "anthropic" }],
        models: [
          {
            id: "anthropic/Claude Sonnet 4.5",
            vendorId: "anthropic",
            name: "Claude Sonnet 4.5",
            releaseDate: "2025-09-25",
            isPrimary: true,
            isLatestPrimary: true
          }
        ]
      },
      null,
      2
    ),
    "utf8"
  );

  const queries = [];
  const result = await runTimelineSearch({
    repoRoot,
    args: ["--vendor=anthropic", "--date=2026-03-12"],
    env: { TAVILY_API_KEY: "test-key" },
    extractClient: async () => [],
    searchClient: async ({ query }) => {
      queries.push(query);
      if (query.includes('"Claude Sonnet 4.6"')) {
        return [
          {
            url: "https://www.anthropic.com/news/claude-sonnet-4-6",
            title: "Introducing Claude Sonnet 4.6 - Anthropic",
            content: "Claude Sonnet 4.6 is our latest model.",
            raw_content: "Claude Sonnet 4.6 is our latest model.",
            published_date: "2026-02-17"
          }
        ];
      }

      return [
        {
          url: "https://www.anthropic.com/news",
          title: "Newsroom - Anthropic",
          content: "Introducing Claude Sonnet 4.6",
          raw_content: "Newsroom entries: Introducing Claude Sonnet 4.6",
          published_date: ""
        }
      ];
    },
    fetchImpl: async () => ({
      ok: true,
      async text() {
        return '<meta property="article:published_time" content="2026-02-17T00:00:00Z">Claude Sonnet 4.6';
      }
    })
  });

  assert.ok(queries.some((query) => query.includes('"Claude Sonnet 4.6"')));
  const sonnet = result.vendorCandidates.anthropic.find((candidate) => candidate.model_name === "Claude Sonnet 4.6");
  assert.ok(sonnet);
  assert.equal(sonnet.release_date_candidate, "2026-02-17");
});

test("runTimelineSearch does not invent Anthropic models from fallback HTML blobs", async () => {
  const repoRoot = await fs.mkdtemp(path.join(os.tmpdir(), "agiptr-timeline-html-"));
  await fs.mkdir(path.join(repoRoot, "config/search-agents"), { recursive: true });
  await fs.mkdir(path.join(repoRoot, "data/canonical"), { recursive: true });

  await fs.writeFile(
    path.join(repoRoot, "config/search-agents/timeline-vendors.json"),
    JSON.stringify(
      {
        schemaVersion: 1,
        vendors: {
          anthropic: {
            displayName: "Anthropic",
            officialDomains: ["www.anthropic.com"],
            families: ["Claude"],
            variants: ["sonnet", "haiku", "opus"],
            queryBudget: 1,
            queryTemplates: {
              discover: ["site:anthropic.com {family} announcement"],
              supplement: [],
              verify: []
            }
          }
        }
      },
      null,
      2
    ),
    "utf8"
  );

  await fs.writeFile(
    path.join(repoRoot, "data/canonical/site-data.json"),
    JSON.stringify(
      {
        vendors: [{ id: "anthropic" }],
        models: []
      },
      null,
      2
    ),
    "utf8"
  );

  const result = await runTimelineSearch({
    repoRoot,
    args: ["--vendor=anthropic", "--date=2026-03-12"],
    env: { TAVILY_API_KEY: "test-key" },
    extractClient: async () => [],
    searchClient: async () => [
      {
        url: "https://www.anthropic.com/news/claude-sonnet-4-5",
        title: "Introducing Claude Sonnet 4.5 - Anthropic",
        content: "Claude Sonnet 4.5 is our best coding model.",
        raw_content: "Claude Sonnet 4.5 is our best coding model.",
        published_date: ""
      }
    ],
    fetchImpl: async () => ({
      ok: true,
      async text() {
        return [
          '<meta property="article:published_time" content="2025-09-25T00:00:00Z">',
          '<script type="application/json">',
          '{"siteSearch":["Claude Sonnet 3.6","Claude 4.5 Haiku","Claude 3.5 Opus"]}',
          "</script>"
        ].join("");
      }
    })
  });

  const candidateNames = result.vendorCandidates.anthropic.map((candidate) => candidate.model_name);
  assert.ok(candidateNames.includes("Claude Sonnet 4.5"));
  assert.equal(candidateNames.includes("Claude Sonnet 3.6"), false);
  assert.equal(candidateNames.includes("Claude 4.5 Haiku"), false);
  assert.equal(candidateNames.includes("Claude 3.5 Opus"), false);
});

test("runTimelineSearch prefers Tavily extract dates for exact model pages over noisy search-result dates", async () => {
  const repoRoot = await fs.mkdtemp(path.join(os.tmpdir(), "agiptr-timeline-extract-"));
  await fs.mkdir(path.join(repoRoot, "config/search-agents"), { recursive: true });
  await fs.mkdir(path.join(repoRoot, "data/canonical"), { recursive: true });

  await fs.writeFile(
    path.join(repoRoot, "config/search-agents/timeline-vendors.json"),
    JSON.stringify(
      {
        schemaVersion: 1,
        vendors: {
          openai: {
            displayName: "OpenAI",
            officialDomains: ["openai.com"],
            families: ["GPT"],
            variants: ["mini"],
            queryBudget: 1,
            followUpBudget: 1,
            queryTemplates: {
              discover: ["site:openai.com {family} release notes"],
              supplement: [],
              verify: []
            }
          }
        }
      },
      null,
      2
    ),
    "utf8"
  );

  await fs.writeFile(
    path.join(repoRoot, "data/canonical/site-data.json"),
    JSON.stringify(
      {
        vendors: [{ id: "openai" }],
        models: []
      },
      null,
      2
    ),
    "utf8"
  );

  const result = await runTimelineSearch({
    repoRoot,
    args: ["--vendor=openai", "--date=2026-03-12"],
    env: { TAVILY_API_KEY: "test-key" },
    searchClient: async () => [
      {
        url: "https://openai.com/index/gpt-4-1/",
        title: "Introducing GPT-4.1 in the API - OpenAI",
        content: "GPT-4.1 improves coding and instruction following.",
        raw_content: "November 20, 2024\nIntroducing GPT-4.1 in the API",
        published_date: ""
      }
    ],
    extractClient: async () => [
      {
        url: "https://openai.com/index/gpt-4-1/",
        raw_content: "April 14, 2025\nIntroducing GPT-4.1 in the API"
      }
    ],
    fetchImpl: async () => ({
      ok: true,
      async text() {
        return "";
      }
    })
  });

  const gpt41 = result.vendorCandidates.openai.find((candidate) => candidate.model_name === "GPT-4.1");
  assert.ok(gpt41);
  assert.equal(gpt41.release_date_candidate, "2025-04-14");
});
