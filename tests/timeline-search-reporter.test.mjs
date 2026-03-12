import test from "node:test";
import assert from "node:assert/strict";

import { diffTimelineCandidatesAgainstCanonical, renderTimelineDiffReport } from "../scripts/lib/timeline-search/reporter.mjs";

test("diffTimelineCandidatesAgainstCanonical reports added models, date changes, and latest changes", () => {
  const canonical = {
    vendors: [{ id: "openai", verification: { verificationStatus: "needs_review" } }],
    models: [
      {
        id: "openai/GPT-5",
        vendorId: "openai",
        name: "GPT-5",
        releaseDate: "2025-08-07",
        isPrimary: true,
        isLatestPrimary: true
      }
    ]
  };
  const candidates = [
    {
      model_name: "GPT-5",
      model_id_candidate: "openai/GPT-5",
      release_date_candidate: "2025-08-08",
      latest_candidate: false,
      conflict_flags: []
    },
    {
      model_name: "GPT-5.4",
      model_id_candidate: "openai/GPT-5.4",
      release_date_candidate: "2026-03-05",
      latest_candidate: true,
      conflict_flags: []
    }
  ];

  const diff = diffTimelineCandidatesAgainstCanonical({
    vendorId: "openai",
    candidates,
    canonicalDataset: canonical
  });

  assert.equal(diff.added.length, 1);
  assert.equal(diff.added[0].model_id_candidate, "openai/GPT-5.4");
  assert.equal(diff.releaseDateChanges.length, 1);
  assert.equal(diff.latestModelChange.previous.modelId, "openai/GPT-5");
  assert.equal(diff.latestModelChange.next.modelId, "openai/GPT-5.4");
});

test("renderTimelineDiffReport prints conflict sections when candidates contain conflicts", () => {
  const report = renderTimelineDiffReport({
    runDate: "2026-03-12",
    vendorDiffs: [
      {
        vendorId: "anthropic",
        added: [],
        releaseDateChanges: [],
        latestModelChange: null,
        conflicts: [
          {
            model_name: "Claude Sonnet 4.6",
            conflict_flags: ["release_date_conflict"]
          }
        ]
      }
    ]
  });

  assert.match(report, /Claude Sonnet 4\.6/);
  assert.match(report, /release_date_conflict/);
});
