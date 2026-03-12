function compareModels(left, right) {
  const dateDiff = new Date(right.releaseDate).getTime() - new Date(left.releaseDate).getTime();
  if (dateDiff !== 0) return dateDiff;
  return right.name.localeCompare(left.name, "zh-CN");
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
