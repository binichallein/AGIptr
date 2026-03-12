import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { loadLegacySiteData } from "./lib/legacy-data-loader.mjs";
import { summarizeVerificationProgress } from "./lib/site-data.mjs";
import {
  buildCanonicalDatasetFromRepository,
  loadCuratedVendorData,
  loadVerificationPlan
} from "./lib/verification-workflow.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const now = new Date().toISOString();
const today = now.slice(0, 10);

async function writeJson(filePath, payload) {
  await fs.writeFile(filePath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
}

async function main() {
  const legacy = await loadLegacySiteData(repoRoot);
  const batchPlan = await loadVerificationPlan(repoRoot);
  const curated = await loadCuratedVendorData(repoRoot);
  const canonical = await buildCanonicalDatasetFromRepository(repoRoot, { generatedAt: now });
  const progress = summarizeVerificationProgress(canonical, batchPlan);
  canonical.metadata = {
    ...canonical.metadata,
    curatedAt: now,
    batchPlanVersion: batchPlan.schemaVersion,
    curatedVendorCount: Object.keys(curated.vendors || {}).length
  };

  const rawPayload = {
    importedAt: now,
    source: "legacy-js",
    vendors: legacy.vendors,
    vendorDetails: legacy.vendorDetails,
    homepageModels: legacy.models
  };

  await writeJson(path.join(repoRoot, "data/raw/legacy-import.json"), rawPayload);
  await writeJson(path.join(repoRoot, "data/canonical/site-data.json"), canonical);

  const report = [
    "# Legacy Import Summary",
    "",
    `- Date: ${today}`,
    `- Imported vendors: ${canonical.vendors.length}`,
    `- Imported models: ${canonical.models.length}`,
    `- Curated vendors applied: ${Object.keys(curated.vendors || {}).length}`,
    `- Release ready: ${progress.releaseReady}`,
    "- Source mode: legacy import plus curated vendor overlays",
    "",
    "## Batch Progress",
    "",
    ...batchPlan.batches.map((batch) => {
      const summary = progress.batches.find((entry) => entry.id === batch.id);
      return `- ${batch.id}: ${summary?.vendorsVerified || 0}/${summary?.vendorsTotal || 0} verified`;
    })
  ].join("\n");

  await fs.writeFile(path.join(repoRoot, `logs/reports/${today}-legacy-import.md`), `${report}\n`, "utf8");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
