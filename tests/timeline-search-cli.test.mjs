import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { buildTimelineSearchRunContext } from "../scripts/lib/timeline-search/index.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

test("buildTimelineSearchRunContext validates TAVILY_API_KEY and computes candidate output paths", async () => {
  await assert.rejects(
    () =>
      buildTimelineSearchRunContext({
        repoRoot,
        args: [],
        env: {}
      }),
    /TAVILY_API_KEY/i
  );

  const context = await buildTimelineSearchRunContext({
    repoRoot,
    args: ["--vendor=openai", "--date=2026-03-12", "--mode=candidates"],
    env: {
      TAVILY_API_KEY: "test-key"
    }
  });

  assert.equal(context.mode, "candidates");
  assert.deepEqual(context.vendorIds, ["openai"]);
  assert.equal(
    context.outputPaths.candidates.openai,
    path.join(repoRoot, "data/candidates/timelines/2026-03-12/openai.json")
  );
  assert.equal(
    context.outputPaths.report,
    path.join(repoRoot, "logs/reports/2026-03-12-timeline-search.md")
  );
});
