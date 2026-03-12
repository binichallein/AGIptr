import test from "node:test";
import assert from "node:assert/strict";

import { extractEvidenceFromSearchDocument } from "../scripts/lib/timeline-search/extractor.mjs";

test("extractEvidenceFromSearchDocument only assigns release-date evidence to title-matched models", () => {
  const evidence = extractEvidenceFromSearchDocument({
    vendorId: "openai",
    knownModelNames: ["GPT-4.1", "GPT-5"],
    result: {
      url: "https://openai.com/index/introducing-gpt-5-4/",
      title: "Introducing GPT-5.4 - OpenAI",
      content: "GPT-5.4 improves on GPT-5 and GPT-4.1 across coding and agent tasks.",
      raw_content: "March 5, 2026. GPT-5.4 improves on GPT-5 and GPT-4.1 across coding and agent tasks."
    }
  });

  const releaseDateEvidence = evidence.filter((item) => item.fact_type === "release_date");
  const nameEvidence = evidence.filter((item) => item.fact_type === "model_name");

  assert.ok(nameEvidence.some((item) => item.fact_value === "GPT-5.4"));
  assert.ok(nameEvidence.some((item) => item.fact_value === "GPT-5"));
  assert.ok(nameEvidence.some((item) => item.fact_value === "GPT-4.1"));
  assert.deepEqual(releaseDateEvidence.map((item) => item.model_name_raw), ["GPT-5.4"]);
  assert.equal(releaseDateEvidence[0].fact_value, "2026-03-05");
});

test("extractEvidenceFromSearchDocument canonicalizes casing and deduplicates repeated model mentions", () => {
  const evidence = extractEvidenceFromSearchDocument({
    vendorId: "openai",
    knownModelNames: ["GPT-5.4"],
    result: {
      url: "https://openai.com/index/introducing-gpt-5-4/",
      title: "introducing gpt-5.4 - openai",
      content: "gpt-5.4 is our best model. GPT-5.4 improves coding.",
      raw_content: ""
    }
  });

  const names = evidence.filter((item) => item.fact_type === "model_name").map((item) => item.fact_value);
  assert.deepEqual(names, ["GPT-5.4"]);
});
