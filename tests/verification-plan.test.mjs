import test from "node:test";
import assert from "node:assert/strict";

import {
  applyCuratedVendorData,
  buildGeneratedSiteData,
  summarizeVerificationProgress,
  verifyCanonicalDataset
} from "../scripts/lib/site-data.mjs";

function createDataset() {
  return {
    metadata: {
      schemaVersion: 1,
      generatedAt: "2026-03-12T00:00:00.000Z"
    },
    vendors: [
      {
        id: "openai",
        name: "OpenAI",
        logo: "./assets/logos/openai.png",
        fallback: "OA",
        verification: {
          verificationStatus: "legacy-import",
          confidence: "legacy",
          sources: [{ label: "legacy", url: "", observedAt: "2026-03-05" }]
        }
      },
      {
        id: "alibaba",
        name: "Qwen",
        logo: "./assets/logos/alibaba.png",
        fallback: "AL",
        verification: {
          verificationStatus: "legacy-import",
          confidence: "legacy",
          sources: [{ label: "legacy", url: "", observedAt: "2026-03-05" }]
        }
      }
    ],
    vendorExtensions: {
      openai: {
        years: [2025],
        excludes: [],
        sourceLabel: "legacy",
        sourceUrl: "",
        majorVersionDetails: {}
      },
      alibaba: {
        years: [2026],
        excludes: [],
        sourceLabel: "legacy",
        sourceUrl: "",
        majorVersionDetails: {}
      }
    },
    models: [
      {
        id: "openai/GPT-4.1",
        vendorId: "openai",
        name: "GPT-4.1",
        releaseDate: "2025-04-14",
        params: "未公开",
        architecture: "Dense",
        type: "通用",
        family: "GPT",
        isPrimary: true,
        parentModelId: null,
        isLatestPrimary: true,
        verification: {
          verificationStatus: "legacy-import",
          confidence: "legacy",
          sources: [{ label: "legacy", url: "", observedAt: "2026-03-05" }]
        }
      },
      {
        id: "alibaba/Qwen3.5-4B",
        vendorId: "alibaba",
        name: "Qwen3.5-4B",
        releaseDate: "2026-02-27",
        params: "4B",
        architecture: "Dense",
        type: "通用",
        family: "Qwen3.5",
        isPrimary: true,
        parentModelId: null,
        isLatestPrimary: true,
        verification: {
          verificationStatus: "legacy-import",
          confidence: "legacy",
          sources: [{ label: "legacy", url: "", observedAt: "2026-03-05" }]
        }
      }
    ]
  };
}

function createBatchPlan() {
  return {
    releasePolicy: {
      mode: "all-vendors-must-be-verified"
    },
    batches: [
      {
        id: "batch-a",
        name: "Pilot",
        vendors: ["openai", "alibaba"]
      }
    ]
  };
}

test("applyCuratedVendorData upgrades selected vendors and models to verified", () => {
  const dataset = createDataset();
  const curated = {
    vendors: {
      openai: {
        vendorVerification: {
          verificationStatus: "verified",
          confidence: "primary",
          batchId: "batch-a",
          sources: [
            {
              label: "OpenAI release notes",
              url: "https://openai.example/releases",
              observedAt: "2026-03-12"
            }
          ]
        },
        vendorExtension: {
          sourceLabel: "OpenAI release notes",
          sourceUrl: "https://openai.example/releases"
        },
        models: {
          "openai/GPT-4.1": {
            verification: {
              verificationStatus: "verified",
              confidence: "primary",
              batchId: "batch-a",
              sources: [
                {
                  label: "GPT-4.1 announcement",
                  url: "https://openai.example/gpt-4-1",
                  observedAt: "2025-04-14"
                }
              ],
              fields: {
                name: ["https://openai.example/gpt-4-1"],
                releaseDate: ["https://openai.example/gpt-4-1"],
                params: ["https://openai.example/gpt-4-1"],
                architecture: ["https://openai.example/gpt-4-1"],
                type: ["https://openai.example/gpt-4-1"],
                family: ["https://openai.example/gpt-4-1"]
              }
            }
          }
        }
      }
    }
  };

  const nextDataset = applyCuratedVendorData(dataset, curated);
  const openaiVendor = nextDataset.vendors.find((vendor) => vendor.id === "openai");
  const openaiModel = nextDataset.models.find((model) => model.id === "openai/GPT-4.1");
  const alibabaVendor = nextDataset.vendors.find((vendor) => vendor.id === "alibaba");

  assert.equal(openaiVendor.verification.verificationStatus, "verified");
  assert.equal(openaiVendor.verification.batchId, "batch-a");
  assert.equal(nextDataset.vendorExtensions.openai.sourceUrl, "https://openai.example/releases");
  assert.equal(openaiModel.verification.verificationStatus, "verified");
  assert.equal(alibabaVendor.verification.verificationStatus, "legacy-import");
});

test("verifyCanonicalDataset enforces verified field coverage for verified vendors only", () => {
  const dataset = applyCuratedVendorData(createDataset(), {
    vendors: {
      openai: {
        vendorVerification: {
          verificationStatus: "verified",
          confidence: "primary",
          batchId: "batch-a",
          sources: [
            {
              label: "OpenAI release notes",
              url: "https://openai.example/releases",
              observedAt: "2026-03-12"
            }
          ]
        },
        vendorExtension: {
          sourceLabel: "OpenAI release notes",
          sourceUrl: "https://openai.example/releases"
        },
        models: {
          "openai/GPT-4.1": {
            verification: {
              verificationStatus: "verified",
              confidence: "primary",
              batchId: "batch-a",
              sources: [
                {
                  label: "GPT-4.1 announcement",
                  url: "https://openai.example/gpt-4-1",
                  observedAt: "2025-04-14"
                }
              ],
              fields: {
                name: ["https://openai.example/gpt-4-1"],
                releaseDate: ["https://openai.example/gpt-4-1"]
              }
            }
          }
        }
      }
    }
  });

  const result = verifyCanonicalDataset(dataset, {
    requireVerifiedSources: true,
    requiredVerifiedModelFields: ["name", "releaseDate", "type"]
  });

  assert.equal(result.ok, false);
  assert.ok(result.errors.some((error) => /verified model openai\/GPT-4\.1/i.test(error)));
  assert.ok(!result.errors.some((error) => /alibaba/i.test(error)));
});

test("buildGeneratedSiteData blocks release mode until all vendors are verified", () => {
  const dataset = createDataset();

  assert.throws(
    () => buildGeneratedSiteData(dataset, { mode: "release" }),
    /release mode requires all vendors to be verified/i
  );
});

test("summarizeVerificationProgress groups vendors by batch and release readiness", () => {
  const dataset = applyCuratedVendorData(createDataset(), {
    vendors: {
      openai: {
        vendorVerification: {
          verificationStatus: "verified",
          confidence: "primary",
          batchId: "batch-a",
          sources: [
            {
              label: "OpenAI release notes",
              url: "https://openai.example/releases",
              observedAt: "2026-03-12"
            }
          ]
        },
        vendorExtension: {
          sourceLabel: "OpenAI release notes",
          sourceUrl: "https://openai.example/releases"
        },
        models: {
          "openai/GPT-4.1": {
            verification: {
              verificationStatus: "verified",
              confidence: "primary",
              batchId: "batch-a",
              sources: [
                {
                  label: "GPT-4.1 announcement",
                  url: "https://openai.example/gpt-4-1",
                  observedAt: "2025-04-14"
                }
              ],
              fields: {
                name: ["https://openai.example/gpt-4-1"],
                releaseDate: ["https://openai.example/gpt-4-1"],
                params: ["https://openai.example/gpt-4-1"],
                architecture: ["https://openai.example/gpt-4-1"],
                type: ["https://openai.example/gpt-4-1"],
                family: ["https://openai.example/gpt-4-1"]
              }
            }
          }
        }
      }
    }
  });

  const summary = summarizeVerificationProgress(dataset, createBatchPlan());

  assert.equal(summary.releaseReady, false);
  assert.equal(summary.batches[0].vendorsTotal, 2);
  assert.equal(summary.batches[0].vendorsVerified, 1);
  assert.equal(summary.vendors.find((vendor) => vendor.id === "openai").batchId, "batch-a");
  assert.equal(summary.vendors.find((vendor) => vendor.id === "alibaba").verificationStatus, "legacy-import");
  assert.equal(summary.batches[0].statusCounts.verified, 1);
  assert.equal(summary.batches[0].statusCounts["legacy-import"], 1);
});

test("applyCuratedVendorData can append a new primary model and promote it to latest", () => {
  const dataset = createDataset();
  const nextDataset = applyCuratedVendorData(dataset, {
    vendors: {
      openai: {
        models: {
          "openai/GPT-5.4": {
            id: "openai/GPT-5.4",
            vendorId: "openai",
            name: "GPT-5.4",
            releaseDate: "2026-03-05",
            params: "未公开",
            architecture: "",
            type: "通用",
            family: "GPT-5",
            isPrimary: true,
            parentModelId: null,
            isLatestPrimary: true,
            verification: {
              verificationStatus: "verified",
              confidence: "primary",
              batchId: "batch-a",
              sources: [
                {
                  label: "Introducing GPT-5.4",
                  url: "https://openai.example/gpt-5-4",
                  observedAt: "2026-03-05"
                }
              ],
              fields: {
                name: ["https://openai.example/gpt-5-4"],
                releaseDate: ["https://openai.example/gpt-5-4"]
              }
            }
          }
        }
      }
    }
  });

  const gpt54 = nextDataset.models.find((model) => model.id === "openai/GPT-5.4");
  const previousLatest = nextDataset.models.find((model) => model.id === "openai/GPT-4.1");

  assert.equal(gpt54?.isLatestPrimary, true);
  assert.equal(previousLatest?.isLatestPrimary, false);
  assert.equal(
    nextDataset.models.filter((model) => model.vendorId === "openai" && model.isLatestPrimary).length,
    1
  );
});
