import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { verifyCanonicalDataset } from "./lib/site-data.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const now = new Date().toISOString();
const today = now.slice(0, 10);

async function appendJsonLine(filePath, payload) {
  await fs.appendFile(filePath, `${JSON.stringify(payload)}\n`, "utf8");
}

async function main() {
  const canonicalPath = path.join(repoRoot, "data/canonical/site-data.json");
  const verificationLogPath = path.join(repoRoot, `logs/verification/${today}-run.jsonl`);
  const reportPath = path.join(repoRoot, `logs/reports/${today}-verification.md`);
  const canonical = JSON.parse(await fs.readFile(canonicalPath, "utf8"));
  const result = verifyCanonicalDataset(canonical, { requireVerifiedSources: true });

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

  const report = [
    "# Canonical Verification Summary",
    "",
    `- Date: ${today}`,
    `- OK: ${result.ok}`,
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

  await fs.writeFile(reportPath, `${report.join("\n")}\n`, "utf8");

  if (!result.ok) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
