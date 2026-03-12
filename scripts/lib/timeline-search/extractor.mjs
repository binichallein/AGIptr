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
    /\bClaude\s\d(?:\.\d)?\b/gi
  ],
  "google-deepmind": [
    /\bGemini\s\d(?:\.\d)?\s(?:Flash|Pro|Ultra|Nano|Thinking)\b/gi,
    /\bGemini\s\d(?:\.\d)?\b/gi
  ]
};

function toIsoDate(value) {
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

function collectKnownModelMatches(text, knownMap) {
  const lower = text.toLowerCase();
  return [...knownMap.values()].filter((modelName) => lower.includes(modelName.toLowerCase()));
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

export function extractEvidenceFromSearchDocument({
  vendorId,
  result,
  knownModelNames = []
}) {
  const sourceUrl = result.url || "";
  const sourceDomain = result.source_domain || new URL(sourceUrl).hostname;
  const text = [result.title, result.content, result.raw_content].filter(Boolean).join("\n");
  const titleAndUrl = [result.title, sourceUrl].filter(Boolean).join("\n");
  const publishedAt = toIsoDate(result.published_date || result.publishedDate || text);
  const knownMap = new Map((knownModelNames || []).map((modelName) => [modelName.toLowerCase(), modelName]));
  const modelNames = [
    ...new Set([
      ...collectRegexMatches(vendorId, text, knownMap),
      ...collectKnownModelMatches(text, knownMap)
    ])
  ];
  const titleMatchedModels = new Set(
    modelNames.filter((modelName) => {
      const pattern = new RegExp(
        `(^|[^a-z0-9])${escapeRegex(modelName.toLowerCase())}(?![.-]?\\d)([^a-z0-9]|$)`,
        "i"
      );
      return pattern.test(titleAndUrl.toLowerCase());
    })
  );

  let evidenceIndex = 0;
  const evidence = [];

  for (const modelName of modelNames) {
    evidenceIndex += 1;
    evidence.push({
      evidence_id: `${vendorId}-${result.url}-${evidenceIndex}-name`,
      vendor_id: vendorId,
      source_url: sourceUrl,
      source_domain: sourceDomain,
      source_type: "search-result",
      officiality: "primary",
      observed_at: publishedAt || "",
      fact_type: "model_name",
      fact_value: modelName,
      model_name_raw: modelName,
      quote_snippet: buildSnippet(text, modelName),
      confidence: "primary",
      extraction_reason: "model name matched known vendor pattern"
    });

    if (publishedAt && titleMatchedModels.has(modelName)) {
      evidenceIndex += 1;
      evidence.push({
        evidence_id: `${vendorId}-${result.url}-${evidenceIndex}-date`,
        vendor_id: vendorId,
        source_url: sourceUrl,
        source_domain: sourceDomain,
        source_type: "search-result",
        officiality: "primary",
        observed_at: publishedAt,
        fact_type: "release_date",
        fact_value: publishedAt,
        model_name_raw: modelName,
        quote_snippet: buildSnippet(text, modelName),
        confidence: "primary",
        extraction_reason: "published date inferred from result metadata or page text"
      });
    }
  }

  return evidence;
}
