import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { writeTimelineSearchOutputs } from "../scripts/lib/timeline-search/index.mjs";

test("writeTimelineSearchOutputs writes candidate JSON, report markdown, and JSONL verification logs", async () => {
  const repoRoot = await fs.mkdtemp(path.join(os.tmpdir(), "agiptr-timeline-"));
  await fs.mkdir(path.join(repoRoot, "data/candidates/timelines/2026-03-12"), { recursive: true });
  await fs.mkdir(path.join(repoRoot, "logs/reports"), { recursive: true });
  await fs.mkdir(path.join(repoRoot, "logs/verification"), { recursive: true });

  await writeTimelineSearchOutputs({
    repoRoot,
    runDate: "2026-03-12",
    vendorCandidates: {
      openai: [
        {
          model_name: "GPT-5.4",
          model_id_candidate: "openai/GPT-5.4",
          release_date_candidate: "2026-03-05",
          latest_candidate: true,
          supporting_evidence_ids: ["e1"],
          conflict_flags: []
        }
      ]
    },
    vendorDiffs: [
      {
        vendorId: "openai",
        added: [
          {
            model_name: "GPT-5.4",
            model_id_candidate: "openai/GPT-5.4"
          }
        ],
        releaseDateChanges: [],
        latestModelChange: null,
        conflicts: []
      }
    ],
    verificationEvents: [
      {
        event_type: "search_result",
        vendor_id: "openai",
        model_id: "",
        field: "candidate",
        old_value: "",
        new_value: "openai/GPT-5.4",
        source_url: "https://openai.com/index/introducing-gpt-5-4/",
        confidence: "primary",
        decision_reason: "official result",
        actor: "timeline-search",
        timestamp: "2026-03-12T00:00:00.000Z"
      }
    ]
  });

  const candidate = JSON.parse(
    await fs.readFile(path.join(repoRoot, "data/candidates/timelines/2026-03-12/openai.json"), "utf8")
  );
  const report = await fs.readFile(path.join(repoRoot, "logs/reports/2026-03-12-timeline-search.md"), "utf8");
  const verification = await fs.readFile(
    path.join(repoRoot, "logs/verification/2026-03-12-timeline-search.jsonl"),
    "utf8"
  );

  assert.equal(candidate.vendorId, "openai");
  assert.equal(candidate.candidates[0].model_name, "GPT-5.4");
  assert.match(report, /openai/i);
  assert.match(verification, /openai\/GPT-5\.4/);
});
