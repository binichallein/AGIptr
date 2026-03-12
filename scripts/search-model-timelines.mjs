import path from "node:path";
import { fileURLToPath } from "node:url";

import { runTimelineSearch } from "./lib/timeline-search/index.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

runTimelineSearch({
  repoRoot,
  args: process.argv.slice(2),
  env: process.env
})
  .then(({ context, vendorDiffs, vendorCandidates }) => {
    const summary = vendorDiffs.map((diff) => {
      const candidates = vendorCandidates[diff.vendorId] || [];
      return `${diff.vendorId}: ${candidates.length} candidates, ${diff.added.length} added, ${diff.conflicts.length} conflicts`;
    });
    console.log(`Timeline search completed for ${context.vendorIds.join(", ")}`);
    summary.forEach((line) => console.log(line));
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
