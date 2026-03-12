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

function normalizeModelName(value) {
  return String(value || "").trim().replace(/\s+/g, " ");
}

function getVariant(modelName) {
  const lower = modelName.toLowerCase();
  return VARIANT_KEYWORDS.find((keyword) => lower.includes(keyword)) || "";
}

function compareDatesDesc(left, right) {
  return new Date(right).getTime() - new Date(left).getTime();
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
    const releaseDates = items
      .filter((item) => item.fact_type === "release_date")
      .map((item) => item.fact_value)
      .filter(Boolean);
    const uniqueReleaseDates = [...new Set(releaseDates)].sort(compareDatesDesc);
    const variant = getVariant(modelName);

    return {
      vendor_id: vendorId,
      model_name: modelName,
      model_id_candidate: `${vendorId}/${modelName}`,
      family: modelName.split(" ")[0] || modelName,
      variant,
      release_date_candidate: uniqueReleaseDates[0] || "",
      is_primary_candidate: variant === "",
      parent_model_candidate: null,
      preview_status: variant === "preview" ? "preview" : "general",
      latest_candidate: false,
      supporting_evidence_ids: items.map((item) => item.evidence_id),
      confidence: "primary",
      conflict_flags: uniqueReleaseDates.length > 1 ? ["release_date_conflict"] : []
    };
  });

  candidates.sort((left, right) => compareDatesDesc(left.release_date_candidate, right.release_date_candidate));
  if (candidates[0]) {
    candidates[0].latest_candidate = true;
  }
  return candidates;
}
