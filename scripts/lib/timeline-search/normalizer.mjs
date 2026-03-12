const VARIANT_KEYWORDS = [
  "mini",
  "turbo",
  "preview",
  "flash",
  "opus",
  "sonnet",
  "haiku",
  "thinking",
  "pro",
  "ultra",
  "nano"
];

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

function normalizeModelName(value) {
  return String(value || "").trim().replace(/\s+/g, " ");
}

function getVariant(modelName) {
  const lower = modelName.toLowerCase();
  return VARIANT_KEYWORDS.find((keyword) => {
    const pattern = new RegExp(`(^|[^a-z0-9])${keyword}([^a-z0-9]|$)`, "i");
    return pattern.test(lower);
  }) || "";
}

function compareDatesDesc(left, right) {
  const rightValue = Number.isNaN(new Date(right).getTime()) ? 0 : new Date(right).getTime();
  const leftValue = Number.isNaN(new Date(left).getTime()) ? 0 : new Date(left).getTime();
  return rightValue - leftValue;
}

function compareDatesAsc(left, right) {
  const leftValue = Number.isNaN(new Date(left).getTime()) ? Number.POSITIVE_INFINITY : new Date(left).getTime();
  const rightValue = Number.isNaN(new Date(right).getTime()) ? Number.POSITIVE_INFINITY : new Date(right).getTime();
  return leftValue - rightValue;
}

function scoreReleaseDateEvidence(item, modelName) {
  if (Number.isFinite(item.release_date_score)) {
    return item.release_date_score;
  }

  const url = String(item.source_url || "").toLowerCase();
  const title = String(item.source_title || "").toLowerCase();
  const lowerModel = String(modelName || "").toLowerCase();
  const modelSlug = lowerModel.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  let score = 0;

  if (url.includes(modelSlug)) score += 4;
  if (title.includes(lowerModel)) score += 3;
  if (title.startsWith(lowerModel)) score += 2;
  if (ANNOUNCEMENT_KEYWORDS.some((keyword) => title.includes(keyword) || url.includes(keyword))) score += 4;
  if (DOWNRANK_KEYWORDS.some((keyword) => title.includes(keyword) || url.includes(keyword))) score -= 4;

  return score;
}

function selectReleaseDate(items, modelName) {
  const releaseDateEvidence = items.filter((item) => item.fact_type === "release_date" && item.fact_value);
  if (!releaseDateEvidence.length) {
    return {
      releaseDate: "",
      conflictFlags: []
    };
  }

  const uniqueReleaseDates = [...new Set(releaseDateEvidence.map((item) => item.fact_value))].sort(compareDatesDesc);
  const scored = releaseDateEvidence
    .map((item) => ({
      date: item.fact_value,
      score: scoreReleaseDateEvidence(item, modelName)
    }))
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }
      return compareDatesAsc(left.date, right.date);
    });

  return {
    releaseDate: scored[0]?.date || "",
    conflictFlags: uniqueReleaseDates.length > 1 ? ["release_date_conflict"] : []
  };
}

export function normalizeEvidenceToTimelineCandidates({ vendorId, officialDomains, evidenceItems }) {
  const grouped = new Map();

  for (const item of evidenceItems || []) {
    if (!officialDomains.includes(item.source_domain)) continue;
    const modelName = normalizeModelName(item.model_name_raw || item.fact_value);
    if (!modelName) continue;
    const current = grouped.get(modelName) || [];
    current.push(item);
    grouped.set(modelName, current);
  }

  const candidates = Array.from(grouped.entries()).map(([modelName, items]) => {
    const variant = getVariant(modelName);
    const { releaseDate, conflictFlags } = selectReleaseDate(items, modelName);

    return {
      vendor_id: vendorId,
      model_name: modelName,
      model_id_candidate: `${vendorId}/${modelName}`,
      family: modelName.split(" ")[0] || modelName,
      variant,
      release_date_candidate: releaseDate,
      is_primary_candidate: variant === "",
      parent_model_candidate: null,
      preview_status: variant === "preview" ? "preview" : "general",
      latest_candidate: false,
      supporting_evidence_ids: items.map((item) => item.evidence_id),
      confidence: "primary",
      conflict_flags: conflictFlags
    };
  });

  candidates.sort((left, right) => compareDatesDesc(left.release_date_candidate, right.release_date_candidate));
  const latestDatedCandidate = candidates.find((candidate) => candidate.release_date_candidate);
  if (latestDatedCandidate) {
    latestDatedCandidate.latest_candidate = true;
  }
  return candidates;
}
