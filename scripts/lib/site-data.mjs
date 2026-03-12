function compareModels(left, right) {
  const dateDiff = new Date(right.releaseDate).getTime() - new Date(left.releaseDate).getTime();
  if (dateDiff !== 0) return dateDiff;
  return right.name.localeCompare(left.name, "zh-CN");
}

function extractObservedAt(sourceLabel) {
  const match = String(sourceLabel || "").match(/(\d{4}-\d{2}-\d{2})/);
  return match ? match[1] : "";
}

function findParentModelId(model, primaryModels) {
  if (model.isDerived === false) return null;
  const candidates = primaryModels.filter((primaryModel) => {
    return model.name === primaryModel.name || model.name.startsWith(`${primaryModel.name}-`);
  });
  if (!candidates.length) return null;
  candidates.sort((left, right) => right.name.length - left.name.length);
  return candidates[0].id;
}

function cloneModel(model) {
  return {
    ...model,
    verification: {
      ...(model.verification || {}),
      sources: [...(model.verification?.sources || [])]
    }
  };
}

function cloneVendor(vendor) {
  return {
    ...vendor,
    verification: {
      ...(vendor.verification || {}),
      sources: [...(vendor.verification?.sources || [])]
    }
  };
}

function verifyCoreSources(record, label, errors, requireVerifiedSources) {
  if (!requireVerifiedSources) return;
  const sources = record?.verification?.sources || [];
  if (!sources.length) {
    errors.push(`${label} must include at least one source`);
  }
}

export function verifyCanonicalDataset(dataset, options = {}) {
  const { requireVerifiedSources = false } = options;
  const errors = [];
  const warnings = [];
  const vendors = dataset?.vendors || [];
  const models = dataset?.models || [];
  const vendorIds = new Set();

  vendors.forEach((vendor) => {
    if (vendorIds.has(vendor.id)) {
      errors.push(`Vendor ${vendor.id} is duplicated`);
      return;
    }
    vendorIds.add(vendor.id);
    verifyCoreSources(vendor, `Vendor ${vendor.id}`, errors, requireVerifiedSources);
  });

  const latestPrimaryCount = new Map();

  models.forEach((model) => {
    if (!vendorIds.has(model.vendorId)) {
      errors.push(`Model ${model.id} references unknown vendor ${model.vendorId}`);
    }
    verifyCoreSources(model, `Model ${model.id}`, errors, requireVerifiedSources);

    if (model.isPrimary && model.isLatestPrimary) {
      latestPrimaryCount.set(model.vendorId, (latestPrimaryCount.get(model.vendorId) || 0) + 1);
    }

    if (!model.isPrimary && !model.parentModelId) {
      errors.push(`Derived model ${model.id} must define parentModelId`);
    }
  });

  vendors.forEach((vendor) => {
    const primaryModels = models.filter((model) => model.vendorId === vendor.id && model.isPrimary);
    if (!primaryModels.length) {
      warnings.push(`Vendor ${vendor.id} does not define any primary models`);
      return;
    }
    const latestCount = latestPrimaryCount.get(vendor.id) || 0;
    if (latestCount !== 1) {
      errors.push(`Vendor ${vendor.id} must have a single latest primary model`);
    }
  });

  return {
    ok: errors.length === 0,
    errors,
    warnings
  };
}

export function buildGeneratedSiteData(dataset) {
  const vendors = (dataset?.vendors || []).map(cloneVendor);
  const models = (dataset?.models || []).map(cloneModel);
  const vendorExtensions = dataset?.vendorExtensions || {};
  const vendorDetails = {};
  const latestPrimaryModels = {};

  vendors.forEach((vendor) => {
    const extension = vendorExtensions[vendor.id] || {};
    const vendorModels = models
      .filter((model) => model.vendorId === vendor.id)
      .sort(compareModels);
    const primaryModels = vendorModels.filter((model) => model.isPrimary);
    const latestPrimary = primaryModels.find((model) => model.isLatestPrimary) || primaryModels[0] || null;

    if (latestPrimary) {
      latestPrimaryModels[vendor.id] = {
        id: latestPrimary.id,
        vendorId: latestPrimary.vendorId,
        name: latestPrimary.name,
        releaseDate: latestPrimary.releaseDate
      };
    }

    vendorDetails[vendor.id] = {
      id: vendor.id,
      name: vendor.name,
      logo: vendor.logo,
      fallback: vendor.fallback,
      years: extension.years || [],
      excludes: extension.excludes || [],
      sourceLabel: extension.sourceLabel || vendor.verification?.sources?.[0]?.label || "",
      sourceUrl: extension.sourceUrl || vendor.verification?.sources?.[0]?.url || "",
      verification: vendor.verification || {
        verificationStatus: "unknown",
        confidence: "unknown",
        sources: []
      },
      models: primaryModels,
      allModels: vendorModels,
      majorVersionDetails: extension.majorVersionDetails || {}
    };
  });

  return {
    metadata: {
      schemaVersion: dataset?.metadata?.schemaVersion || 1,
      generatedAt: dataset?.metadata?.generatedAt || new Date().toISOString()
    },
    vendors,
    latestPrimaryModels,
    vendorDetails
  };
}

export function buildCanonicalDatasetFromLegacy({ generatedAt, vendors, vendorDetails }) {
  const canonicalVendors = [];
  const canonicalModels = [];
  const vendorExtensions = {};

  (vendors || []).forEach((vendor) => {
    const detail = vendorDetails?.[vendor.id];
    if (!detail) return;

    const observedAt = extractObservedAt(detail.source);
    const allModels = (detail.allModels || detail.models || []).map((model) => ({ ...model }));
    const primaryIds = new Set((detail.models || []).map((model) => model.id));
    const primaryModels = allModels.filter((model) => primaryIds.has(model.id));

    let expanded = true;
    while (expanded) {
      expanded = false;
      allModels.forEach((model) => {
        if (primaryIds.has(model.id)) return;
        if (findParentModelId(model, primaryModels)) return;
        primaryIds.add(model.id);
        primaryModels.push(model);
        expanded = true;
      });
    }

    const sortedPrimaryModels = [...primaryModels].sort(compareModels);
    const latestPrimaryId = sortedPrimaryModels[0]?.id || "";

    canonicalVendors.push({
      id: vendor.id,
      name: vendor.name,
      logo: vendor.logo,
      fallback: vendor.fallback,
      verification: {
        verificationStatus: "legacy-import",
        confidence: "legacy",
        sources: detail.source
          ? [
              {
                label: detail.source,
                url: "",
                observedAt
              }
            ]
          : []
      }
    });

    vendorExtensions[vendor.id] = {
      years: [...(detail.years || [])],
      excludes: [...(detail.excludes || [])],
      sourceLabel: detail.source || "",
      sourceUrl: "",
      majorVersionDetails: detail.majorVersionDetails || {}
    };

    allModels.forEach((model) => {
      const isPrimary = primaryIds.has(model.id);
      canonicalModels.push({
        ...model,
        vendorId: vendor.id,
        isPrimary,
        parentModelId: isPrimary ? null : findParentModelId(model, primaryModels),
        isLatestPrimary: isPrimary && model.id === latestPrimaryId,
        verification: {
          verificationStatus: "legacy-import",
          confidence: "legacy",
          sources: detail.source
            ? [
                {
                  label: detail.source,
                  url: "",
                  observedAt
                }
              ]
            : []
        }
      });
    });
  });

  return {
    metadata: {
      schemaVersion: 1,
      generatedAt: generatedAt || new Date().toISOString()
    },
    vendors: canonicalVendors,
    vendorExtensions,
    models: canonicalModels.sort((left, right) => {
      if (left.vendorId !== right.vendorId) {
        return left.vendorId.localeCompare(right.vendorId, "zh-CN");
      }
      return compareModels(left, right);
    })
  };
}
