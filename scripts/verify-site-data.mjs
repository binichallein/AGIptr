import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { summarizeVerificationProgress, verifyCanonicalDataset } from "./lib/site-data.mjs";
import { loadVerificationPlan } from "./lib/verification-workflow.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const now = new Date().toISOString();
const today = now.slice(0, 10);
const args = process.argv.slice(2);
const modeArg = args.find((argument) => argument.startsWith("--mode="));
const mode = modeArg ? modeArg.split("=")[1] : "staging";

async function appendJsonLine(filePath, payload) {
  await fs.appendFile(filePath, `${JSON.stringify(payload)}\n`, "utf8");
}

async function main() {
  const canonicalPath = path.join(repoRoot, "data/canonical/site-data.json");
  const verificationLogPath = path.join(repoRoot, `logs/verification/${today}-run.jsonl`);
  const reportPath = path.join(repoRoot, `logs/reports/${today}-verification.md`);
  const batchPlan = await loadVerificationPlan(repoRoot);
  const canonical = JSON.parse(await fs.readFile(canonicalPath, "utf8"));
  const result = verifyCanonicalDataset(canonical, {
    requireVerifiedSources: true,
    requiredVerifiedModelFields: batchPlan.releasePolicy?.requiredVerifiedModelFields || [],
    requiredVendorVerifiedModelFields: batchPlan.releasePolicy?.requiredVendorVerifiedModelFields || []
  });
  const progress = summarizeVerificationProgress(canonical, batchPlan);

  await fs.writeFile(verificationLogPath, "", "utf8");
  for (const error of result.errors) {
    await appendJsonLine(verificationLogPath, {
      event_type: "verification_error",
      vendor_id: "",
      model_id: "",
      field: "canonical",
      old_value: "",
      new_value: "",
      source_url: "",
      confidence: "",
      decision_reason: error,
      actor: "verify-site-data",
      timestamp: now
    });
  }

  for (const warning of result.warnings) {
    await appendJsonLine(verificationLogPath, {
      event_type: "verification_warning",
      vendor_id: "",
      model_id: "",
      field: "canonical",
      old_value: "",
      new_value: "",
      source_url: "",
      confidence: "",
      decision_reason: warning,
      actor: "verify-site-data",
      timestamp: now
    });
  }

  for (const batch of progress.batches) {
    await appendJsonLine(verificationLogPath, {
      event_type: "batch_status",
      vendor_id: "",
      model_id: "",
      field: batch.id,
      old_value: "",
      new_value: JSON.stringify(batch.statusCounts),
      source_url: "",
      confidence: "",
      decision_reason: `${batch.vendorsVerified}/${batch.vendorsTotal} vendors verified`,
      actor: "verify-site-data",
      timestamp: now
    });
  }

  for (const vendor of progress.vendors) {
    await appendJsonLine(verificationLogPath, {
      event_type: "vendor_status",
      vendor_id: vendor.id,
      model_id: "",
      field: "verificationStatus",
      old_value: "",
      new_value: vendor.verificationStatus,
      source_url: "",
      confidence: "",
      decision_reason: `batchId=${vendor.batchId || "unassigned"}`,
      actor: "verify-site-data",
      timestamp: now
    });
  }

  const report = [
    "# Canonical Verification Summary",
    "",
    `- Date: ${today}`,
    `- Mode: ${mode}`,
    `- OK: ${result.ok}`,
    `- Release ready: ${progress.releaseReady}`,
    `- Errors: ${result.errors.length}`,
    `- Warnings: ${result.warnings.length}`
  ];

  if (result.errors.length) {
    report.push("", "## Errors", "");
    result.errors.forEach((error) => {
      report.push(`- ${error}`);
    });
  }

  if (result.warnings.length) {
    report.push("", "## Warnings", "");
    result.warnings.forEach((warning) => {
      report.push(`- ${warning}`);
    });
  }

  report.push("", "## Batch Progress", "");
  progress.batches.forEach((batch) => {
    report.push(
      `- ${batch.id}: ${batch.vendorsVerified}/${batch.vendorsTotal} verified; statuses ${JSON.stringify(batch.statusCounts)}`
    );
  });

  await fs.writeFile(reportPath, `${report.join("\n")}\n`, "utf8");

  if (!result.ok || (mode === "release" && !progress.releaseReady)) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
