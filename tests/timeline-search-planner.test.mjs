import test from "node:test";
import assert from "node:assert/strict";

import { buildTimelineQueryPlan } from "../scripts/lib/timeline-search/planner.mjs";

test("buildTimelineQueryPlan emits discover supplement and verify queries for each vendor", () => {
  const config = {
    id: "google-deepmind",
    families: ["Gemini"],
    variants: ["flash", "pro", "thinking"],
    queryTemplates: {
      discover: ["site:blog.google {family} announcement"],
      supplement: ["site:developers.googleblog.com {family} {variant} release"],
      verify: ["site:ai.google.dev latest {family} model"]
    }
  };

  const plan = buildTimelineQueryPlan(config);

  assert.equal(plan.vendorId, "google-deepmind");
  assert.ok(plan.queries.some((query) => query.intent === "discover" && /Gemini/.test(query.q)));
  assert.ok(plan.queries.some((query) => query.intent === "supplement" && /flash/.test(query.q)));
  assert.ok(plan.queries.some((query) => query.intent === "verify" && /latest Gemini model/.test(query.q)));
});
