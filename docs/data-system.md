# AGIptr Data System

## Overview

AGIptr now has one runtime data source:

- `data/generated/site-data.js`

Everything else exists to produce or verify that file:

- `data/raw/legacy-import.json`: raw import snapshot from legacy JS files
- `data/canonical/site-data.json`: canonical repository truth source
- `data/generated/site-data.json`: generated JSON payload for verification/debugging
- `data/generated/site-data.js`: generated browser payload loaded by the site
- `data/verification/batch-plan.json`: batch rollout and release-gate policy
- `data/curated/vendors/*.json`: official-source overlays applied on top of the legacy import
- `config/search-agents/timeline-vendors.json`: vendor-specific search-agent config
- `data/candidates/timelines/YYYY-MM-DD/*.json`: candidate timelines discovered by the Tavily search agent

Current migration status:

- runtime uses generated data only
- canonical data is built from `legacy import -> curated overlays`
- batch-a vendors now have explicit verification state and official source URLs
- the repository is still in staging mode; release mode is intentionally blocked
- model-level verification is ahead of vendor-level verification for batch-a
- candidate-only timeline discovery now exists for `openai`, `anthropic`, and `google-deepmind`

## Canonical Schema

Top-level keys:

- `metadata`
  - `schemaVersion`
  - `generatedAt`
  - `curatedAt`
  - `batchPlanVersion`
  - `curatedVendorCount`
- `vendors`
  - `id`
  - `name`
  - `logo`
  - `fallback`
  - `verification`
- `vendorExtensions`
  - `years`
  - `excludes`
  - `sourceLabel`
  - `sourceUrl`
  - `majorVersionDetails`
- `models`
  - `id`
  - `vendorId`
  - `name`
  - `releaseDate`
  - `isPrimary`
  - `parentModelId`
  - `isLatestPrimary`
  - `verification`
  - legacy display fields preserved from imported data

Core invariants:

- every model belongs to a known vendor
- every vendor has exactly one `isLatestPrimary === true` model
- every derived model must have a `parentModelId`
- homepage latest model and detail-page latest model must come from the same canonical record

## Verification States

Current statuses:

- `verified`: hard-fact fields have acceptable sources
- `needs_review`: sources exist but are not yet trusted enough
- `legacy-import`: imported from old repo data without full source-url curation
- `conflict`: multiple sources disagree and need explicit resolution

Current repository state is intentionally honest:

- canonical data is structurally consistent
- canonical data is partially source-curated for batch-a vendors
- OpenAI latest now resolves to `GPT-5.4` from the March 5, 2026 official announcement
- Anthropic latest now resolves to `Claude Sonnet 4.6` from the February 17, 2026 official announcement
- do not relabel a vendor to `verified` until every displayed field has acceptable sources and the release gate passes
- candidate timeline outputs are exploratory evidence, not curated truth
- candidate latest-model selection only applies when the candidate has a valid release date

## Commands

Rebuild the data pipeline:

```bash
node scripts/import-legacy-data.mjs
node scripts/generate-site-data.mjs --mode=staging
node scripts/verify-site-data.mjs --mode=staging
```

Attempt a release build:

```bash
node scripts/generate-site-data.mjs --mode=release
node scripts/verify-site-data.mjs --mode=release
```

Run the timeline search agent:

```bash
TAVILY_API_KEY=... node scripts/search-model-timelines.mjs --mode=candidates
TAVILY_API_KEY=... node scripts/search-model-timelines.mjs --vendor=openai --date=2026-03-12 --mode=candidates
```

Run tests:

```bash
node --test tests/site-data.test.mjs tests/verification-plan.test.mjs tests/verification-workflow.test.mjs tests/timeline-search-config.test.mjs tests/timeline-search-normalizer.test.mjs tests/timeline-search-reporter.test.mjs tests/timeline-search-planner.test.mjs tests/timeline-search-fetcher.test.mjs tests/timeline-search-cli.test.mjs tests/timeline-search-integration.test.mjs tests/timeline-search-extractor.test.mjs tests/timeline-search-tavily-client.test.mjs
```

Run syntax checks:

```bash
node --check index.js
node --check detail.js
node --check scripts/lib/site-data.mjs
node --check scripts/lib/verification-workflow.mjs
node --check scripts/lib/legacy-data-loader.mjs
node --check scripts/lib/timeline-search/config.mjs
node --check scripts/lib/timeline-search/planner.mjs
node --check scripts/lib/timeline-search/fetcher.mjs
node --check scripts/lib/timeline-search/normalizer.mjs
node --check scripts/lib/timeline-search/reporter.mjs
node --check scripts/lib/timeline-search/extractor.mjs
node --check scripts/lib/timeline-search/tavily-client.mjs
node --check scripts/lib/timeline-search/index.mjs
node --check scripts/import-legacy-data.mjs
node --check scripts/generate-site-data.mjs
node --check scripts/verify-site-data.mjs
node --check scripts/search-model-timelines.mjs
```

## AI Maintenance Rules

- Never edit `data/generated/*` by hand; regenerate it.
- Prefer changing `data/curated/vendors/*.json` or import logic, then rerun generation.
- Use `data/candidates/timelines/*` and `logs/reports/*-timeline-search.md` as evidence review inputs, not as published truth.
- Keep `data/verification/batch-plan.json` authoritative for batch assignment and release policy.
- If a model looks “derived” but has no primary parent, either:
  - add/verify the real primary model, or
  - keep the explicit promotion decision documented in `logs/decisions/`.
- `verified` model status means core fields are evidenced.
- `verified` vendor status is stricter: every model under that vendor and every displayed field must be evidenced.
- Search-agent candidate outputs may contain conflicts or undated models; they must be promoted manually into curated overlays.
- Every accuracy-related change must leave behind:
  - a verification log entry
  - a summary report
  - a commit message with sources and verification commands
