import fs from "node:fs/promises";
import path from "node:path";

import { loadLegacySiteData } from "./legacy-data-loader.mjs";
import {
  applyCuratedVendorData,
  buildCanonicalDatasetFromLegacy
} from "./site-data.mjs";

async function readJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, "utf8"));
}

export async function loadVerificationPlan(repoRoot) {
  return readJson(path.join(repoRoot, "data/verification/batch-plan.json"));
}

export async function loadCuratedVendorData(repoRoot) {
  const vendorsDir = path.join(repoRoot, "data/curated/vendors");
  const entries = await fs.readdir(vendorsDir, { withFileTypes: true });
  const files = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => entry.name)
    .sort((left, right) => left.localeCompare(right, "en"));
  const curated = { vendors: {} };

  for (const fileName of files) {
    const payload = await readJson(path.join(vendorsDir, fileName));
    if (!payload.vendorId) {
      throw new Error(`Curated vendor file ${fileName} is missing vendorId`);
    }
    curated.vendors[payload.vendorId] = {
      vendorVerification: payload.vendorVerification || {},
      vendorExtension: payload.vendorExtension || {},
      models: payload.models || {}
    };
  }

  return curated;
}

export async function buildCanonicalDatasetFromRepository(repoRoot, options = {}) {
  const generatedAt = options.generatedAt || new Date().toISOString();
  const legacy = await loadLegacySiteData(repoRoot);
  const canonical = buildCanonicalDatasetFromLegacy({
    generatedAt,
    vendors: legacy.vendors,
    vendorDetails: legacy.vendorDetails
  });
  const curated = await loadCuratedVendorData(repoRoot);

  return applyCuratedVendorData(canonical, curated);
}
