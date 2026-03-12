import test from "node:test";
import assert from "node:assert/strict";

import { extractEvidenceFromSearchDocument, extractFallbackDateEvidenceFromHtml } from "../scripts/lib/timeline-search/extractor.mjs";

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
  assert.equal(nameEvidence.some((item) => item.fact_value === "GPT-5"), false);
  assert.equal(nameEvidence.some((item) => item.fact_value === "GPT-4.1"), false);
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

test("extractEvidenceFromSearchDocument does not treat derived-model pages as exact matches for the parent model", () => {
  const evidence = extractEvidenceFromSearchDocument({
    vendorId: "openai",
    knownModelNames: ["GPT-4o", "GPT-4o mini"],
    result: {
      url: "https://openai.com/index/gpt-4o-mini-advancing-cost-efficient-intelligence/",
      title: "GPT-4o mini: advancing cost-efficient intelligence",
      content: "GPT-4o mini outperforms GPT-4o on cost efficiency.",
      raw_content: "July 18, 2024. GPT-4o mini outperforms GPT-4o on cost efficiency."
    }
  });

  const names = evidence.filter((item) => item.fact_type === "model_name").map((item) => item.fact_value);
  const releaseDates = evidence.filter((item) => item.fact_type === "release_date").map((item) => item.model_name_raw);

  assert.deepEqual(names, ["GPT-4o mini"]);
  assert.deepEqual(releaseDates, ["GPT-4o mini"]);
});

test("extractFallbackDateEvidenceFromHtml prefers the date nearest the page title over unrelated dates earlier in the text", () => {
  const evidence = extractFallbackDateEvidenceFromHtml({
    vendorId: "openai",
    result: {
      url: "https://openai.com/index/gpt-4-1/",
      title: "Introducing GPT-4.1 in the API - OpenAI"
    },
    existingEvidence: [
      {
        fact_type: "model_name",
        fact_value: "GPT-4.1",
        model_name_raw: "GPT-4.1"
      }
    ],
    html: [
      "GPT-4.5 Preview will be turned off in three months, on July 14, 2025, to allow time for developers to transition.",
      "Table of contents",
      "Livestream replay",
      "April 14, 2025",
      "Introducing GPT-4.1 in the API"
    ].join("\n"),
    sourceType: "tavily-extract"
  });

  assert.equal(evidence.length, 1);
  assert.equal(evidence[0].fact_value, "2025-04-14");
});
