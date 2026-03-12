function expandTemplate(template, replacements) {
  return Object.entries(replacements).reduce(
    (value, [key, replacement]) => value.replaceAll(`{${key}}`, replacement),
    template
  );
}

function normalizeDomainForSiteQuery(domain) {
  return String(domain || "").replace(/^www\./, "");
}

export function buildTimelineQueryPlan(config) {
  const discoverQueries = [];
  const supplementQueries = [];
  const verifyQueries = [];

  (config.queryTemplates?.discover || []).forEach((template) => {
    (config.families || []).forEach((family) => {
      discoverQueries.push({
        intent: "discover",
        q: expandTemplate(template, { family })
      });
    });
  });

  (config.queryTemplates?.supplement || []).forEach((template) => {
    (config.families || []).forEach((family) => {
      (config.variants || []).forEach((variant) => {
        supplementQueries.push({
          intent: "supplement",
          q: expandTemplate(template, { family, variant })
        });
      });
    });
  });

  (config.queryTemplates?.verify || []).forEach((template) => {
    (config.families || []).forEach((family) => {
      verifyQueries.push({
        intent: "verify",
        q: expandTemplate(template, { family })
      });
    });
  });

  const queries = [...discoverQueries, ...verifyQueries, ...supplementQueries];
  const deduped = [];
  const seen = new Set();
  for (const query of queries) {
    const key = `${query.intent}::${query.q}`;
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(query);
  }

  return {
    vendorId: config.id,
    queries: config.queryBudget ? deduped.slice(0, config.queryBudget) : deduped
  };
}

export function buildExactModelFollowUpQueries({
  officialDomains = [],
  unresolvedModelNames = [],
  followUpBudget = 0
}) {
  const siteDomain = normalizeDomainForSiteQuery(officialDomains[0] || "");
  if (!siteDomain || !followUpBudget) {
    return [];
  }

  const deduped = [];
  const seen = new Set();
  for (const modelName of unresolvedModelNames || []) {
    const normalizedName = String(modelName || "").trim();
    if (!normalizedName) continue;
    const key = normalizedName.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push({
      intent: "follow-up",
      q: `site:${siteDomain} "${normalizedName}"`
    });
    if (deduped.length >= followUpBudget) {
      break;
    }
  }

  return deduped;
}
