function expandTemplate(template, replacements) {
  return Object.entries(replacements).reduce(
    (value, [key, replacement]) => value.replaceAll(`{${key}}`, replacement),
    template
  );
}

export function buildTimelineQueryPlan(config) {
  const queries = [];

  (config.queryTemplates?.discover || []).forEach((template) => {
    (config.families || []).forEach((family) => {
      queries.push({
        intent: "discover",
        q: expandTemplate(template, { family })
      });
    });
  });

  (config.queryTemplates?.supplement || []).forEach((template) => {
    (config.families || []).forEach((family) => {
      (config.variants || []).forEach((variant) => {
        queries.push({
          intent: "supplement",
          q: expandTemplate(template, { family, variant })
        });
      });
    });
  });

  (config.queryTemplates?.verify || []).forEach((template) => {
    (config.families || []).forEach((family) => {
      queries.push({
        intent: "verify",
        q: expandTemplate(template, { family })
      });
    });
  });

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
    queries: deduped
  };
}
