function compareModels(left, right) {
  const dateDiff = new Date(right.releaseDate).getTime() - new Date(left.releaseDate).getTime();
  if (dateDiff !== 0) return dateDiff;
  return right.name.localeCompare(left.name, "zh-CN");
}

function cloneDataset(dataset) {
  return {
    metadata: { ...(dataset?.metadata || {}) },
    vendors: (dataset?.vendors || []).map(cloneVendor),
    vendorExtensions: Object.fromEntries(
      Object.entries(dataset?.vendorExtensions || {}).map(([vendorId, extension]) => [
        vendorId,
        {
          ...extension,
          years: [...(extension?.years || [])],
          excludes: [...(extension?.excludes || [])],
          majorVersionDetails: extension?.majorVersionDetails || {}
        }
      ])
    ),
    models: (dataset?.models || []).map(cloneModel)
  };
}

function mergeVerification(base = {}, override = {}) {
  return {
    ...base,
    ...override,
    sources: override.sources ? [...override.sources] : [...(base.sources || [])],
    fields: {
      ...(base.fields || {}),
      ...(override.fields || {})
    }
  };
}

function hasSourceUrl(record) {
  return (record?.verification?.sources || []).some((source) => Boolean(source?.url));
}

function verifyModelFieldCoverage(model, fields, errors) {
  fields.forEach((field) => {
    const fieldSources = model.verification?.fields?.[field] || [];
    if (!fieldSources.length) {
      errors.push(`Verified model ${model.id} must define field verification for ${field}`);
    }
  });
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
      sources: [...(model.verification?.sources || [])],
      fields: {
        ...(model.verification?.fields || {})
      }
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
    return;
  }
  if (record?.verification?.verificationStatus !== "legacy-import" && !hasSourceUrl(record)) {
    errors.push(`${label} must include at least one source URL`);
  }
}

export function verifyCanonicalDataset(dataset, options = {}) {
  const {
    requireVerifiedSources = false,
    requiredVerifiedModelFields = [],
    requiredVendorVerifiedModelFields = []
  } = options;
  const errors = [];
  const warnings = [];
  const vendors = dataset?.vendors || [];
  const models = dataset?.models || [];
  const vendorExtensions = dataset?.vendorExtensions || {};
  const vendorIds = new Set();
  const verifiedVendorIds = new Set();

  vendors.forEach((vendor) => {
    if (vendorIds.has(vendor.id)) {
      errors.push(`Vendor ${vendor.id} is duplicated`);
      return;
    }
    vendorIds.add(vendor.id);
    verifyCoreSources(vendor, `Vendor ${vendor.id}`, errors, requireVerifiedSources);
    if (vendor.verification?.verificationStatus === "verified") {
      verifiedVendorIds.add(vendor.id);
      if (!vendorExtensions[vendor.id]?.sourceUrl) {
        errors.push(`Verified vendor ${vendor.id} must define vendorExtensions.sourceUrl`);
      }
      if (!vendor.verification?.batchId) {
        errors.push(`Verified vendor ${vendor.id} must define verification.batchId`);
      }
    }
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

    if (model.verification?.verificationStatus === "verified") {
      verifyModelFieldCoverage(model, requiredVerifiedModelFields, errors);
    }

    if (verifiedVendorIds.has(model.vendorId)) {
      if (model.verification?.verificationStatus !== "verified") {
        errors.push(`Verified vendor ${model.vendorId} requires verified model ${model.id}`);
      }
      verifyModelFieldCoverage(model, requiredVendorVerifiedModelFields, errors);
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
  const options = arguments[1] || {};
  const mode = options.mode || "staging";
  const vendors = (dataset?.vendors || []).map(cloneVendor);
  const models = (dataset?.models || []).map(cloneModel);
  const vendorExtensions = dataset?.vendorExtensions || {};
  const vendorDetails = {};
  const latestPrimaryModels = {};

  if (mode === "release") {
    const notVerified = vendors.filter((vendor) => vendor.verification?.verificationStatus !== "verified");
    if (notVerified.length) {
      throw new Error("Release mode requires all vendors to be verified");
    }
  }

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
      generatedAt: dataset?.metadata?.generatedAt || new Date().toISOString(),
      mode
    },
    vendors,
    latestPrimaryModels,
    vendorDetails
  };
}

export function applyCuratedVendorData(dataset, curatedData = {}) {
  const nextDataset = cloneDataset(dataset);
  const curatedVendors = curatedData.vendors || {};

  Object.entries(curatedVendors).forEach(([vendorId, payload]) => {
    const vendor = nextDataset.vendors.find((entry) => entry.id === vendorId);
    if (!vendor) return;

    if (payload.vendorVerification) {
      vendor.verification = mergeVerification(vendor.verification, payload.vendorVerification);
    }

    if (payload.vendorExtension) {
      nextDataset.vendorExtensions[vendorId] = {
        ...(nextDataset.vendorExtensions[vendorId] || {}),
        ...payload.vendorExtension
      };
    }

    const modelOverrides = payload.models || {};
    const existingModelIds = new Set(
      nextDataset.models
        .filter((model) => model.vendorId === vendorId)
        .map((model) => model.id)
    );

    nextDataset.models = nextDataset.models.map((model) => {
      if (model.vendorId !== vendorId || !Object.hasOwn(modelOverrides, model.id)) {
        return model;
      }
      const override = modelOverrides[model.id];
      return {
        ...model,
        ...Object.fromEntries(Object.entries(override).filter(([key]) => key !== "verification")),
        verification: override.verification
          ? mergeVerification(model.verification, override.verification)
          : model.verification
      };
    });

    Object.entries(modelOverrides).forEach(([modelId, override]) => {
      if (existingModelIds.has(modelId)) return;
      nextDataset.models.push({
        ...Object.fromEntries(Object.entries(override).filter(([key]) => key !== "verification")),
        id: override.id || modelId,
        vendorId: override.vendorId || vendorId,
        verification: mergeVerification({}, override.verification || {})
      });
    });

    const latestPrimaryModels = nextDataset.models.filter(
      (model) => model.vendorId === vendorId && model.isPrimary && model.isLatestPrimary
    );
    if (latestPrimaryModels.length > 1) {
      latestPrimaryModels
        .sort(compareModels)
        .forEach((model, index) => {
          model.isLatestPrimary = index === 0;
        });
    }
  });

  nextDataset.models.sort((left, right) => {
    if (left.vendorId !== right.vendorId) {
      return left.vendorId.localeCompare(right.vendorId, "zh-CN");
    }
    return compareModels(left, right);
  });

  return nextDataset;
}

export function summarizeVerificationProgress(dataset, batchPlan = {}) {
  const vendorBatchMap = new Map();
  const batches = (batchPlan?.batches || []).map((batch) => {
    batch.vendors.forEach((vendorId) => vendorBatchMap.set(vendorId, batch.id));
    return {
      id: batch.id,
      name: batch.name,
      vendorsTotal: batch.vendors.length,
      vendorsVerified: 0,
      statusCounts: {
        verified: 0,
        needs_review: 0,
        "legacy-import": 0,
        conflict: 0,
        unknown: 0
      }
    };
  });

  const vendors = (dataset?.vendors || []).map((vendor) => {
    const batchId = vendor.verification?.batchId || vendorBatchMap.get(vendor.id) || "";
    return {
      id: vendor.id,
      batchId,
      verificationStatus: vendor.verification?.verificationStatus || "unknown"
    };
  });

  batches.forEach((batch) => {
    const batchVendors = vendors.filter((vendor) => vendor.batchId === batch.id);
    batch.vendorsVerified = batchVendors.filter((vendor) => vendor.verificationStatus === "verified").length;
    batchVendors.forEach((vendor) => {
      const status = Object.hasOwn(batch.statusCounts, vendor.verificationStatus)
        ? vendor.verificationStatus
        : "unknown";
      batch.statusCounts[status] += 1;
    });
  });

  return {
    releaseReady: vendors.every((vendor) => vendor.verificationStatus === "verified"),
    vendors,
    batches
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
