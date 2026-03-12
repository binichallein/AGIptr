import test from "node:test";
import assert from "node:assert/strict";

import { normalizeEvidenceToTimelineCandidates } from "../scripts/lib/timeline-search/normalizer.mjs";

test("normalizeEvidenceToTimelineCandidates keeps public variants and drops candidates without official evidence", () => {
  const candidates = normalizeEvidenceToTimelineCandidates({
    vendorId: "openai",
    officialDomains: ["openai.com"],
    evidenceItems: [
      {
        evidence_id: "1",
        vendor_id: "openai",
        source_url: "https://openai.com/index/gpt-4o-mini/",
        source_domain: "openai.com",
        fact_type: "model_name",
        fact_value: "GPT-4o mini",
        model_name_raw: "GPT-4o mini",
        observed_at: "2024-07-18"
      },
      {
        evidence_id: "2",
        vendor_id: "openai",
        source_url: "https://openai.com/index/gpt-4o-mini/",
        source_domain: "openai.com",
        fact_type: "release_date",
        fact_value: "2024-07-18",
        model_name_raw: "GPT-4o mini",
        observed_at: "2024-07-18"
      },
      {
        evidence_id: "3",
        vendor_id: "openai",
        source_url: "https://openai.com/index/hello-gpt-4o/",
        source_domain: "openai.com",
        fact_type: "model_name",
        fact_value: "GPT-4o",
        model_name_raw: "GPT-4o",
        observed_at: "2024-05-13"
      },
      {
        evidence_id: "4",
        vendor_id: "openai",
        source_url: "https://openai.com/index/hello-gpt-4o/",
        source_domain: "openai.com",
        fact_type: "release_date",
        fact_value: "2024-05-13",
        model_name_raw: "GPT-4o",
        observed_at: "2024-05-13"
      },
      {
        evidence_id: "5",
        vendor_id: "openai",
        source_url: "https://example.com/gpt-4.5/",
        source_domain: "example.com",
        fact_type: "model_name",
        fact_value: "GPT-4.5",
        model_name_raw: "GPT-4.5",
        observed_at: "2025-02-27"
      }
    ]
  });

  assert.equal(candidates.length, 2);
  assert.equal(candidates[0].model_name, "GPT-4o mini");
  assert.equal(candidates[0].release_date_candidate, "2024-07-18");
  assert.equal(candidates[0].variant, "mini");
  assert.equal(candidates[1].model_name, "GPT-4o");
  assert.equal(candidates.some((candidate) => candidate.model_name === "GPT-4.5"), false);
});

test("normalizeEvidenceToTimelineCandidates flags conflicting release dates", () => {
  const [candidate] = normalizeEvidenceToTimelineCandidates({
    vendorId: "anthropic",
    officialDomains: ["anthropic.com"],
    evidenceItems: [
      {
        evidence_id: "1",
        vendor_id: "anthropic",
        source_url: "https://www.anthropic.com/news/claude-sonnet",
        source_domain: "anthropic.com",
        fact_type: "model_name",
        fact_value: "Claude Sonnet 4.6",
        model_name_raw: "Claude Sonnet 4.6",
        observed_at: "2026-02-17"
      },
      {
        evidence_id: "2",
        vendor_id: "anthropic",
        source_url: "https://www.anthropic.com/news/claude-sonnet",
        source_domain: "anthropic.com",
        fact_type: "release_date",
        fact_value: "2026-02-17",
        model_name_raw: "Claude Sonnet 4.6",
        observed_at: "2026-02-17"
      },
      {
        evidence_id: "3",
        vendor_id: "anthropic",
        source_url: "https://www.anthropic.com/news/claude-sonnet-4-6",
        source_domain: "anthropic.com",
        fact_type: "release_date",
        fact_value: "2026-02-19",
        model_name_raw: "Claude Sonnet 4.6",
        observed_at: "2026-02-19"
      }
    ]
  });

  assert.equal(candidate.model_name, "Claude Sonnet 4.6");
  assert.ok(candidate.conflict_flags.includes("release_date_conflict"));
});

test("normalizeEvidenceToTimelineCandidates only marks latest on candidates with a valid release date", () => {
  const candidates = normalizeEvidenceToTimelineCandidates({
    vendorId: "anthropic",
    officialDomains: ["anthropic.com"],
    evidenceItems: [
      {
        evidence_id: "1",
        vendor_id: "anthropic",
        source_url: "https://www.anthropic.com/news/claude-sonnet-4-6",
        source_domain: "anthropic.com",
        fact_type: "model_name",
        fact_value: "Claude Sonnet 4.6",
        model_name_raw: "Claude Sonnet 4.6",
        observed_at: "2026-03-12"
      },
      {
        evidence_id: "2",
        vendor_id: "anthropic",
        source_url: "https://www.anthropic.com/news/claude-3-7-sonnet",
        source_domain: "anthropic.com",
        fact_type: "model_name",
        fact_value: "Claude 3.7 Sonnet",
        model_name_raw: "Claude 3.7 Sonnet",
        observed_at: "2025-02-24"
      },
      {
        evidence_id: "3",
        vendor_id: "anthropic",
        source_url: "https://www.anthropic.com/news/claude-3-7-sonnet",
        source_domain: "anthropic.com",
        fact_type: "release_date",
        fact_value: "2025-02-24",
        model_name_raw: "Claude 3.7 Sonnet",
        observed_at: "2025-02-24"
      }
    ]
  });

  assert.equal(candidates.find((candidate) => candidate.model_name === "Claude Sonnet 4.6").latest_candidate, false);
  assert.equal(candidates.find((candidate) => candidate.model_name === "Claude 3.7 Sonnet").latest_candidate, true);
});
