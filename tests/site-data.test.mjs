import test from "node:test";
import assert from "node:assert/strict";

import {
  buildCanonicalDatasetFromLegacy,
  buildGeneratedSiteData,
  verifyCanonicalDataset
} from "../scripts/lib/site-data.mjs";

function createCanonicalFixture() {
  return {
    metadata: {
      schemaVersion: 1,
      generatedAt: "2026-03-12T00:00:00.000Z"
    },
    vendors: [
      {
        id: "alpha",
        name: "Alpha",
        logo: "./assets/logos/alpha.svg",
        fallback: "AL",
        verification: {
          verificationStatus: "verified",
          confidence: "primary",
          sources: [
            {
              label: "Alpha Blog",
              url: "https://alpha.example/blog",
              observedAt: "2026-03-10"
            }
          ]
        }
      },
      {
        id: "beta",
        name: "Beta",
        logo: "./assets/logos/beta.svg",
        fallback: "BE",
        verification: {
          verificationStatus: "verified",
          confidence: "primary",
          sources: [
            {
              label: "Beta Blog",
              url: "https://beta.example/blog",
              observedAt: "2026-03-10"
            }
          ]
        }
      }
    ],
    vendorExtensions: {
      alpha: {
        years: [2025, 2026],
        excludes: ["Quantized variants"],
        sourceLabel: "Alpha official release log",
        sourceUrl: "https://alpha.example/releases",
        majorVersionDetails: {}
      },
      beta: {
        years: [2026],
        excludes: [],
        sourceLabel: "Beta official release log",
        sourceUrl: "https://beta.example/releases",
        majorVersionDetails: {}
      }
    },
    models: [
      {
        id: "alpha/alpha-1",
        vendorId: "alpha",
        name: "Alpha 1",
        releaseDate: "2025-01-10",
        isPrimary: true,
        parentModelId: null,
        isLatestPrimary: false,
        verification: {
          verificationStatus: "verified",
          confidence: "primary",
          sources: [
            {
              label: "Alpha release",
              url: "https://alpha.example/alpha-1",
              observedAt: "2025-01-10"
            }
          ]
        }
      },
      {
        id: "alpha/alpha-2",
        vendorId: "alpha",
        name: "Alpha 2",
        releaseDate: "2026-02-01",
        isPrimary: true,
        parentModelId: null,
        isLatestPrimary: true,
        verification: {
          verificationStatus: "verified",
          confidence: "primary",
          sources: [
            {
              label: "Alpha release",
              url: "https://alpha.example/alpha-2",
              observedAt: "2026-02-01"
            }
          ]
        }
      },
      {
        id: "alpha/alpha-2-chat",
        vendorId: "alpha",
        name: "Alpha 2 Chat",
        releaseDate: "2026-02-03",
        isPrimary: false,
        parentModelId: "alpha/alpha-2",
        isLatestPrimary: false,
        verification: {
          verificationStatus: "verified",
          confidence: "primary",
          sources: [
            {
              label: "Alpha release",
              url: "https://alpha.example/alpha-2-chat",
              observedAt: "2026-02-03"
            }
          ]
        }
      },
      {
        id: "beta/beta-1",
        vendorId: "beta",
        name: "Beta 1",
        releaseDate: "2026-01-15",
        isPrimary: true,
        parentModelId: null,
        isLatestPrimary: true,
        verification: {
          verificationStatus: "verified",
          confidence: "primary",
          sources: [
            {
              label: "Beta release",
              url: "https://beta.example/beta-1",
              observedAt: "2026-01-15"
            }
          ]
        }
      }
    ]
  };
}

test("buildGeneratedSiteData derives homepage latest models from canonical primary models", () => {
  const generated = buildGeneratedSiteData(createCanonicalFixture());

  assert.equal(generated.metadata.generatedAt, "2026-03-12T00:00:00.000Z");
  assert.equal(generated.latestPrimaryModels.alpha.name, "Alpha 2");
  assert.equal(generated.latestPrimaryModels.beta.name, "Beta 1");

  assert.deepEqual(
    generated.vendorDetails.alpha.models.map((model) => model.id),
    ["alpha/alpha-2", "alpha/alpha-1"]
  );
  assert.deepEqual(
    generated.vendorDetails.alpha.allModels.map((model) => model.id),
    ["alpha/alpha-2-chat", "alpha/alpha-2", "alpha/alpha-1"]
  );
  assert.equal(generated.vendorDetails.alpha.allModels[0].parentModelId, "alpha/alpha-2");
});

test("verifyCanonicalDataset reports duplicate latest-primary flags and missing core sources", () => {
  const dataset = createCanonicalFixture();
  dataset.models[0].isLatestPrimary = true;
  dataset.models[1].verification.sources = [];

  const result = verifyCanonicalDataset(dataset, { requireVerifiedSources: true });

  assert.equal(result.ok, false);
  assert.ok(result.errors.some((error) => /single latest primary/i.test(error)));
  assert.ok(result.errors.some((error) => /at least one source/i.test(error)));
});

test("buildCanonicalDatasetFromLegacy materializes explicit primary and parent relationships", () => {
  const canonical = buildCanonicalDatasetFromLegacy({
    generatedAt: "2026-03-12T00:00:00.000Z",
    vendors: [
      {
        id: "alpha",
        name: "Alpha",
        logo: "./assets/logos/alpha.svg",
        fallback: "AL"
      }
    ],
    vendorDetails: {
      alpha: {
        id: "alpha",
        name: "Alpha",
        logo: "./assets/logos/alpha.svg",
        years: [2025, 2026],
        source: "Alpha official release log（统计时间：2026-03-10）",
        excludes: ["Preview variants"],
        models: [
          {
            id: "alpha/alpha-1",
            name: "Alpha 1",
            releaseDate: "2025-01-10"
          },
          {
            id: "alpha/alpha-2",
            name: "Alpha 2",
            releaseDate: "2026-02-01"
          }
        ],
        allModels: [
          {
            id: "alpha/alpha-1",
            name: "Alpha 1",
            releaseDate: "2025-01-10"
          },
          {
            id: "alpha/alpha-2",
            name: "Alpha 2",
            releaseDate: "2026-02-01"
          },
          {
            id: "alpha/alpha-2-chat",
            name: "Alpha 2-chat",
            releaseDate: "2026-02-03",
            isDerived: true
          }
        ],
        majorVersionDetails: {}
      }
    }
  });

  assert.equal(canonical.vendors[0].verification.verificationStatus, "legacy-import");
  assert.equal(canonical.vendorExtensions.alpha.sourceLabel, "Alpha official release log（统计时间：2026-03-10）");
  assert.equal(canonical.models.find((model) => model.id === "alpha/alpha-2").isLatestPrimary, true);
  assert.equal(canonical.models.find((model) => model.id === "alpha/alpha-2-chat").parentModelId, "alpha/alpha-2");
});

test("buildCanonicalDatasetFromLegacy promotes orphan derived variants to primary models", () => {
  const canonical = buildCanonicalDatasetFromLegacy({
    generatedAt: "2026-03-12T00:00:00.000Z",
    vendors: [
      {
        id: "alpha",
        name: "Alpha",
        logo: "./assets/logos/alpha.svg",
        fallback: "AL"
      }
    ],
    vendorDetails: {
      alpha: {
        id: "alpha",
        name: "Alpha",
        logo: "./assets/logos/alpha.svg",
        years: [2026],
        source: "Alpha official release log（统计时间：2026-03-10）",
        excludes: [],
        models: [],
        allModels: [
          {
            id: "alpha/alpha-vision-instruct",
            name: "Alpha-Vision-Instruct",
            releaseDate: "2026-02-03",
            isDerived: true
          }
        ],
        majorVersionDetails: {}
      }
    }
  });

  const importedModel = canonical.models[0];
  assert.equal(importedModel.isPrimary, true);
  assert.equal(importedModel.parentModelId, null);
  assert.equal(importedModel.isLatestPrimary, true);
});
