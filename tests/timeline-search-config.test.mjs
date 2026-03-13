import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { loadTimelineVendorConfig } from "../scripts/lib/timeline-search/config.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

test("loadTimelineVendorConfig loads exactly three timeline vendors with official domains and query templates", async () => {
  const config = await loadTimelineVendorConfig(repoRoot);
  const vendorIds = Object.keys(config.vendors).sort();

  assert.deepEqual(vendorIds, ["anthropic", "google-deepmind", "openai"]);

  for (const vendorId of vendorIds) {
    const vendor = config.vendors[vendorId];
    assert.ok(vendor.displayName);
    assert.ok(Array.isArray(vendor.officialDomains));
    assert.ok(vendor.officialDomains.length > 0);
    assert.ok(Array.isArray(vendor.families));
    assert.ok(vendor.families.length > 0);
    assert.ok(Array.isArray(vendor.variants));
    assert.ok(vendor.variants.length > 0);
    assert.ok(Array.isArray(vendor.queryTemplates.discover));
    assert.ok(Array.isArray(vendor.queryTemplates.supplement));
    assert.ok(Array.isArray(vendor.queryTemplates.verify));
  }

  assert.ok(config.vendors.openai.variants.includes("mini"));
  assert.ok(config.vendors.anthropic.variants.includes("sonnet"));
  assert.ok(config.vendors["google-deepmind"].variants.includes("flash"));
  assert.deepEqual(config.vendors.openai.excludedDomains, ["community.openai.com", "help.openai.com"]);
  assert.ok(config.vendors.openai.queryTemplates.discover.every((template) => template.startsWith("site:openai.com/index")));
  assert.ok(config.vendors.openai.queryTemplates.supplement.every((template) => template.startsWith("site:openai.com/index")));
  assert.ok(config.vendors.openai.queryTemplates.verify.every((template) => template.startsWith("site:openai.com/index")));
});
