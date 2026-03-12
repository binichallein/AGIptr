import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  applyCuratedVendorData,
  buildCanonicalDatasetFromLegacy,
  summarizeVerificationProgress,
  verifyCanonicalDataset
} from "../scripts/lib/site-data.mjs";
import {
  buildCanonicalDatasetFromRepository,
  loadCuratedVendorData,
  loadVerificationPlan
} from "../scripts/lib/verification-workflow.mjs";
import { loadLegacySiteData } from "../scripts/lib/legacy-data-loader.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

test("loadVerificationPlan covers all 25 vendors exactly once", async () => {
  const plan = await loadVerificationPlan(repoRoot);
  const covered = new Set();

  assert.equal(plan.batches.length, 4);
  for (const batch of plan.batches) {
    for (const vendorId of batch.vendors) {
      assert.equal(covered.has(vendorId), false, `duplicate vendor in plan: ${vendorId}`);
      covered.add(vendorId);
    }
  }

  assert.equal(covered.size, 25);
  assert.equal(plan.releasePolicy.mode, "all-vendors-must-be-verified");
});

test("loadCuratedVendorData returns batch-a vendor curation with official sources", async () => {
  const curated = await loadCuratedVendorData(repoRoot);

  assert.ok(curated.vendors.openai);
  assert.ok(curated.vendors.anthropic);
  assert.ok(curated.vendors["google-deepmind"]);
  assert.ok(curated.vendors.alibaba);
  assert.equal(curated.vendors.openai.vendorVerification.batchId, "batch-a");
  assert.equal(curated.vendors.alibaba.vendorVerification.batchId, "batch-a");
  assert.match(
    curated.vendors.anthropic.models["anthropic/Claude 3.7 Sonnet"].verification.sources[0].url,
    /^https:\/\/www\.anthropic\.com\//
  );
});

test("verified models require core field coverage even when vendor is not yet verified", async () => {
  const legacy = await loadLegacySiteData(repoRoot);
  const canonical = buildCanonicalDatasetFromLegacy({
    generatedAt: "2026-03-12T00:00:00.000Z",
    vendors: legacy.vendors,
    vendorDetails: legacy.vendorDetails
  });
  const curated = await loadCuratedVendorData(repoRoot);
  const nextDataset = applyCuratedVendorData(canonical, curated);
  const result = verifyCanonicalDataset(nextDataset, {
    requireVerifiedSources: true,
    requiredVerifiedModelFields: ["name", "releaseDate"]
  });

  assert.equal(result.ok, true, result.errors.join("\n"));
});

test("verification progress shows batch-a as in progress before full vendor verification", async () => {
  const legacy = await loadLegacySiteData(repoRoot);
  const canonical = buildCanonicalDatasetFromLegacy({
    generatedAt: "2026-03-12T00:00:00.000Z",
    vendors: legacy.vendors,
    vendorDetails: legacy.vendorDetails
  });
  const plan = await loadVerificationPlan(repoRoot);
  const curated = await loadCuratedVendorData(repoRoot);
  const nextDataset = applyCuratedVendorData(canonical, curated);
  const progress = summarizeVerificationProgress(nextDataset, plan);
  const batchA = progress.batches.find((batch) => batch.id === "batch-a");

  assert.equal(progress.releaseReady, false);
  assert.equal(batchA.vendorsTotal, 4);
  assert.equal(batchA.vendorsVerified, 0);
  assert.equal(batchA.statusCounts.needs_review, 4);
  assert.equal(
    progress.vendors.filter((vendor) => vendor.batchId === "batch-a").length,
    4
  );
});

test("buildCanonicalDatasetFromRepository includes the latest curated OpenAI and Anthropic models", async () => {
  const canonical = await buildCanonicalDatasetFromRepository(repoRoot, {
    generatedAt: "2026-03-12T00:00:00.000Z"
  });
  const openaiLatest = canonical.models.find((model) => model.vendorId === "openai" && model.isLatestPrimary);
  const anthropicLatest = canonical.models.find(
    (model) => model.vendorId === "anthropic" && model.isLatestPrimary
  );

  assert.equal(openaiLatest?.id, "openai/GPT-5.4");
  assert.equal(anthropicLatest?.id, "anthropic/Claude Sonnet 4.6");
});
