# Timeline Search Agent Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a Tavily-backed timeline search agent that produces candidate timelines and diff reports for OpenAI, Anthropic, and Google DeepMind without mutating curated truth.

**Architecture:** Add a vendor-config-driven CLI under `scripts/search-model-timelines.mjs` that orchestrates planner, Tavily retrieval, official-domain fetch, evidence extraction, normalization, and reporting. Persist outputs to candidate JSON, JSONL verification logs, and markdown reports so future AI maintainers can audit and promote results manually.

**Tech Stack:** Node.js ESM scripts, built-in `fetch`, Tavily REST API, existing canonical dataset loaders, Node test runner.

---

### Task 1: Document search-agent config and test loading

**Files:**
- Create: `config/search-agents/timeline-vendors.json`
- Create: `tests/timeline-search-config.test.mjs`

**Step 1: Write the failing test**

Add tests that require:
- exactly three vendors
- official domain allowlists for each vendor
- family and variant lexicons
- query templates for discover, supplement, and verify intents

**Step 2: Run test to verify it fails**

Run: `node --test tests/timeline-search-config.test.mjs`
Expected: FAIL because the config file and loader do not exist yet.

**Step 3: Write minimal implementation**

Create the config file with:
- `openai`
- `anthropic`
- `google-deepmind`

Each entry should define:
- `displayName`
- `officialDomains`
- `families`
- `variants`
- `queryTemplates`

**Step 4: Run test to verify it passes**

Run: `node --test tests/timeline-search-config.test.mjs`
Expected: PASS

**Step 5: Commit**

```bash
git add config/search-agents/timeline-vendors.json tests/timeline-search-config.test.mjs
git commit -m "test(search): add timeline vendor config coverage"
```

### Task 2: Add failing tests for normalization and diffing

**Files:**
- Create: `tests/timeline-search-normalizer.test.mjs`
- Create: `tests/timeline-search-reporter.test.mjs`

**Step 1: Write the failing tests**

Add tests that require:
- evidence items to normalize into candidate model records
- public variants to be retained as separate candidates
- candidates without official evidence to be dropped
- diff reports to detect added models, release-date changes, and latest-model changes

**Step 2: Run tests to verify they fail**

Run: `node --test tests/timeline-search-normalizer.test.mjs tests/timeline-search-reporter.test.mjs`
Expected: FAIL because the normalizer/reporter modules do not exist yet.

**Step 3: Write minimal implementation**

Create:
- `scripts/lib/timeline-search/normalizer.mjs`
- `scripts/lib/timeline-search/reporter.mjs`

Implement:
- candidate grouping by normalized model name
- official-source filtering
- conflict flagging
- canonical diff generation

**Step 4: Run tests to verify they pass**

Run: `node --test tests/timeline-search-normalizer.test.mjs tests/timeline-search-reporter.test.mjs`
Expected: PASS

**Step 5: Commit**

```bash
git add tests/timeline-search-normalizer.test.mjs tests/timeline-search-reporter.test.mjs scripts/lib/timeline-search/normalizer.mjs scripts/lib/timeline-search/reporter.mjs
git commit -m "feat(search): add candidate normalization and diff reporting"
```

### Task 3: Add failing tests for retrieval planning and official-domain filtering

**Files:**
- Create: `tests/timeline-search-planner.test.mjs`
- Create: `tests/timeline-search-fetcher.test.mjs`

**Step 1: Write the failing tests**

Require:
- planner to emit discover/supplement/verify queries per vendor
- fetcher to reject out-of-policy domains
- official-domain link following to stop after two hops

**Step 2: Run tests to verify they fail**

Run: `node --test tests/timeline-search-planner.test.mjs tests/timeline-search-fetcher.test.mjs`
Expected: FAIL because the planner/fetcher modules do not exist yet.

**Step 3: Write minimal implementation**

Create:
- `scripts/lib/timeline-search/planner.mjs`
- `scripts/lib/timeline-search/fetcher.mjs`

Implement:
- query-plan generation from vendor config
- domain allowlist checking
- bounded follow-link behavior helpers

**Step 4: Run tests to verify they pass**

Run: `node --test tests/timeline-search-planner.test.mjs tests/timeline-search-fetcher.test.mjs`
Expected: PASS

**Step 5: Commit**

```bash
git add tests/timeline-search-planner.test.mjs tests/timeline-search-fetcher.test.mjs scripts/lib/timeline-search/planner.mjs scripts/lib/timeline-search/fetcher.mjs
git commit -m "feat(search): add planning and official-domain filtering"
```

### Task 4: Add Tavily client and orchestration entrypoint

**Files:**
- Create: `tests/timeline-search-cli.test.mjs`
- Create: `scripts/lib/timeline-search/tavily-client.mjs`
- Create: `scripts/lib/timeline-search/extractor.mjs`
- Create: `scripts/lib/timeline-search/index.mjs`
- Create: `scripts/search-model-timelines.mjs`

**Step 1: Write the failing test**

Add a CLI-level test that requires:
- vendor selection
- candidate output path generation
- markdown report path generation
- environment-variable validation for `TAVILY_API_KEY`

**Step 2: Run test to verify it fails**

Run: `node --test tests/timeline-search-cli.test.mjs`
Expected: FAIL because the CLI and orchestration modules do not exist yet.

**Step 3: Write minimal implementation**

Implement:
- Tavily REST client with request shaping
- HTML/text fetch-to-evidence extraction helpers
- orchestration pipeline for planner -> retriever -> fetcher -> extractor -> normalizer -> reporter
- CLI argument parsing for `--vendor`, `--date`, and `--mode=candidates`

**Step 4: Run test to verify it passes**

Run: `node --test tests/timeline-search-cli.test.mjs`
Expected: PASS

**Step 5: Commit**

```bash
git add tests/timeline-search-cli.test.mjs scripts/lib/timeline-search/tavily-client.mjs scripts/lib/timeline-search/extractor.mjs scripts/lib/timeline-search/index.mjs scripts/search-model-timelines.mjs
git commit -m "feat(search): add Tavily-backed timeline search CLI"
```

### Task 5: Add candidate output integration against current canonical data

**Files:**
- Create: `tests/timeline-search-integration.test.mjs`
- Modify: `scripts/lib/verification-workflow.mjs`
- Modify: `docs/data-system.md`
- Modify: `docs/runbooks/update-model-data.md`

**Step 1: Write the failing test**

Require:
- canonical data can be loaded as diff baseline
- candidate outputs land under `data/candidates/timelines/<date>/`
- report output includes additions, date changes, latest changes, and conflicts

**Step 2: Run test to verify it fails**

Run: `node --test tests/timeline-search-integration.test.mjs`
Expected: FAIL because orchestration is not yet wired to repository paths.

**Step 3: Write minimal implementation**

Wire repository paths and document:
- how to run the search agent
- that it does not mutate curated truth
- where candidate outputs and reports land

**Step 4: Run test to verify it passes**

Run: `node --test tests/timeline-search-integration.test.mjs`
Expected: PASS

**Step 5: Commit**

```bash
git add tests/timeline-search-integration.test.mjs scripts/lib/verification-workflow.mjs docs/data-system.md docs/runbooks/update-model-data.md
git commit -m "docs(search): document candidate timeline workflow"
```

### Task 6: Run the search agent for three vendors and persist candidate artifacts

**Files:**
- Create: `data/candidates/timelines/2026-03-12/openai.json`
- Create: `data/candidates/timelines/2026-03-12/anthropic.json`
- Create: `data/candidates/timelines/2026-03-12/google-deepmind.json`
- Create: `logs/verification/2026-03-12-timeline-search.jsonl`
- Create: `logs/reports/2026-03-12-timeline-search.md`
- Modify: `logs/reports/2026-03-12-summary.md`

**Step 1: Run the live search agent**

Run:

```bash
TAVILY_API_KEY=... node scripts/search-model-timelines.mjs --mode=candidates
```

Expected:
- candidate files for all three vendors
- a structured search log
- a markdown diff report

**Step 2: Inspect output for obvious policy violations**

Check:
- only official domains count as primary evidence
- public variants are preserved
- conflicts are listed, not auto-resolved

**Step 3: Update the summary report**

Document:
- vendors searched
- candidate counts
- latest-model candidate results
- known conflicts or low-confidence areas

**Step 4: Commit**

```bash
git add data/candidates/timelines/2026-03-12 logs/verification/2026-03-12-timeline-search.jsonl logs/reports/2026-03-12-timeline-search.md logs/reports/2026-03-12-summary.md
git commit -m "data(search): add first-pass timeline candidates for gpt claude and gemini"
```

### Task 7: Final verification and push

**Files:**
- Modify as needed: generated logs/artifacts from final verification pass

**Step 1: Run full tests**

Run:

```bash
node --test tests/site-data.test.mjs tests/verification-plan.test.mjs tests/verification-workflow.test.mjs tests/timeline-search-config.test.mjs tests/timeline-search-normalizer.test.mjs tests/timeline-search-reporter.test.mjs tests/timeline-search-planner.test.mjs tests/timeline-search-fetcher.test.mjs tests/timeline-search-cli.test.mjs tests/timeline-search-integration.test.mjs
```

Expected: PASS

**Step 2: Run syntax checks**

Run:

```bash
node --check index.js detail.js scripts/lib/site-data.mjs scripts/lib/verification-workflow.mjs scripts/lib/legacy-data-loader.mjs scripts/import-legacy-data.mjs scripts/generate-site-data.mjs scripts/verify-site-data.mjs scripts/search-model-timelines.mjs scripts/lib/timeline-search/planner.mjs scripts/lib/timeline-search/fetcher.mjs scripts/lib/timeline-search/extractor.mjs scripts/lib/timeline-search/normalizer.mjs scripts/lib/timeline-search/reporter.mjs scripts/lib/timeline-search/tavily-client.mjs scripts/lib/timeline-search/index.mjs
```

Expected: PASS

**Step 3: Run staging pipeline to ensure no regression**

Run:

```bash
node scripts/import-legacy-data.mjs
node scripts/generate-site-data.mjs --mode=staging
node scripts/verify-site-data.mjs --mode=staging
```

Expected: PASS

**Step 4: Push**

```bash
git push origin feat/accuracy-canonical-data
```

**Step 5: Report**

Summarize:
- what the agent now does
- what outputs were generated
- what conflicts remain
