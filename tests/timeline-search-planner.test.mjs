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

test("buildTimelineQueryPlan respects a query budget when provided", () => {
  const config = {
    id: "openai",
    families: ["GPT", "o1", "o3", "o4"],
    variants: ["mini", "turbo", "preview", "nano", "reasoning"],
    queryBudget: 12,
    queryTemplates: {
      discover: ["site:openai.com {family} announcement", "site:openai.com {family} release notes"],
      supplement: ["site:openai.com {family} {variant} release", "site:openai.com {family} {variant} announcement"],
      verify: ["site:openai.com latest {family} model"]
    }
  };

  const plan = buildTimelineQueryPlan(config);

  assert.ok(plan.queries.length <= 12);
  assert.ok(plan.queries.some((query) => query.intent === "discover"));
  assert.ok(plan.queries.some((query) => query.intent === "verify"));
});
