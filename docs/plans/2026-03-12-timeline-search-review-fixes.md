# Timeline Search Review Fixes Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix the four blocking review issues in the timeline search agent so candidate outputs stop inventing models, stop misclassifying Gemini variants, pick saner release dates, and recover missing official announcement pages like Claude Sonnet 4.6.

**Architecture:** Keep the current `search -> extract -> normalize -> report` pipeline, but tighten evidence quality. The main changes are: token-aware variant parsing, evidence scoring for release dates, safer fallback date extraction that does not mine full HTML for extra models, and a second exact-model search pass for unresolved official models.

**Tech Stack:** Node.js, built-in test runner, JSON artifacts, Tavily Search API, local fetch-based fallback HTML retrieval.

---

### Task 1: Lock in the failing behaviors with tests

**Files:**
- Modify: `tests/timeline-search-normalizer.test.mjs`
- Modify: `tests/timeline-search-extractor.test.mjs`
- Modify: `tests/timeline-search-integration.test.mjs`

**Step 1: Write the failing tests**

- Add a normalizer test proving `Gemini 3.1 Pro` gets variant `pro`, not `mini`.
- Add a normalizer test proving when one model has both introduction-date and later mention-date evidence, the chosen `release_date_candidate` prefers the stronger introduction evidence instead of the latest mention.
- Add an extractor test proving fallback HTML from Anthropic pages does not create invented models like `Claude Sonnet 3.6` or `Claude 4.5 Haiku`.
- Add an integration test proving a list page mention like `Claude Sonnet 4.6` triggers an exact follow-up search and ends with a dated candidate when the exact page exists.

**Step 2: Run the tests to verify they fail**

Run: `node --test tests/timeline-search-normalizer.test.mjs tests/timeline-search-extractor.test.mjs tests/timeline-search-integration.test.mjs`

Expected: FAIL on the new assertions.

**Step 3: Commit**

```bash
git add tests/timeline-search-normalizer.test.mjs tests/timeline-search-extractor.test.mjs tests/timeline-search-integration.test.mjs
git commit -m "test(search): cover timeline review regressions"
```

### Task 2: Fix extraction quality and release-date selection

**Files:**
- Modify: `scripts/lib/timeline-search/extractor.mjs`
- Modify: `scripts/lib/timeline-search/normalizer.mjs`
- Test: `tests/timeline-search-extractor.test.mjs`
- Test: `tests/timeline-search-normalizer.test.mjs`

**Step 1: Write the minimal implementation**

- Make variant detection token-aware so `Gemini` does not match `mini`.
- Add evidence quality metadata for date evidence, using title/url/model exactness and announcement-like URL/title signals.
- Change release-date selection to choose the strongest date evidence first, then earliest date within the best quality tier, while still flagging conflicts.
- Split fallback HTML handling so it only contributes date evidence or title metadata for models already matched from the original result instead of discovering fresh model names from raw HTML blobs.

**Step 2: Run the targeted tests**

Run: `node --test tests/timeline-search-normalizer.test.mjs tests/timeline-search-extractor.test.mjs`

Expected: PASS

**Step 3: Commit**

```bash
git add scripts/lib/timeline-search/extractor.mjs scripts/lib/timeline-search/normalizer.mjs tests/timeline-search-normalizer.test.mjs tests/timeline-search-extractor.test.mjs
git commit -m "fix(search): tighten evidence extraction and release-date scoring"
```

### Task 3: Add exact-model follow-up search for unresolved official models

**Files:**
- Modify: `scripts/lib/timeline-search/planner.mjs`
- Modify: `scripts/lib/timeline-search/index.mjs`
- Possibly modify: `scripts/lib/timeline-search/tavily-client.mjs`
- Test: `tests/timeline-search-integration.test.mjs`
- Test: `tests/timeline-search-planner.test.mjs`

**Step 1: Write the minimal implementation**

- After the first search pass, identify official model mentions that still lack dated exact-page evidence.
- Run a bounded second pass of exact-phrase queries such as `site:anthropic.com "Claude Sonnet 4.6"` against the vendor’s official domains.
- Keep the query budget bounded and log the follow-up queries/results in the verification log.

**Step 2: Run the targeted tests**

Run: `node --test tests/timeline-search-planner.test.mjs tests/timeline-search-integration.test.mjs`

Expected: PASS

**Step 3: Commit**

```bash
git add scripts/lib/timeline-search/planner.mjs scripts/lib/timeline-search/index.mjs scripts/lib/timeline-search/tavily-client.mjs tests/timeline-search-planner.test.mjs tests/timeline-search-integration.test.mjs
git commit -m "feat(search): resolve unresolved models with exact follow-up queries"
```

### Task 4: Regenerate artifacts and verify the review findings are resolved

**Files:**
- Regenerate: `data/candidates/timelines/2026-03-12/*.json`
- Regenerate: `logs/reports/2026-03-12-timeline-search.md`
- Regenerate: `logs/verification/2026-03-12-timeline-search.jsonl`
- Update if needed: `logs/reports/2026-03-12-summary.md`

**Step 1: Run the search agent and verification**

Run:

```bash
TAVILY_API_KEY=... node scripts/search-model-timelines.mjs --date=2026-03-12 --mode=candidates
node --test tests/timeline-search-normalizer.test.mjs tests/timeline-search-extractor.test.mjs tests/timeline-search-planner.test.mjs tests/timeline-search-integration.test.mjs
node --test tests/site-data.test.mjs tests/verification-plan.test.mjs tests/verification-workflow.test.mjs tests/timeline-search-config.test.mjs tests/timeline-search-reporter.test.mjs tests/timeline-search-fetcher.test.mjs tests/timeline-search-cli.test.mjs tests/timeline-search-tavily-client.test.mjs
node --check index.js detail.js scripts/lib/site-data.mjs scripts/lib/verification-workflow.mjs scripts/lib/legacy-data-loader.mjs scripts/import-legacy-data.mjs scripts/generate-site-data.mjs scripts/verify-site-data.mjs scripts/lib/timeline-search/config.mjs scripts/lib/timeline-search/planner.mjs scripts/lib/timeline-search/fetcher.mjs scripts/lib/timeline-search/normalizer.mjs scripts/lib/timeline-search/reporter.mjs scripts/lib/timeline-search/extractor.mjs scripts/lib/timeline-search/tavily-client.mjs scripts/lib/timeline-search/index.mjs scripts/search-model-timelines.mjs
```

Expected:
- Tests pass
- Syntax checks pass
- `google-deepmind` candidates no longer classify `Gemini*` as `mini`
- Anthropic candidates no longer invent fake models
- `Claude Sonnet 4.6` gets exact-page evidence and a date
- OpenAI `GPT-4o` / `GPT-4.1` / `o4-mini` stop using later mention dates as candidate release dates

**Step 2: Commit**

```bash
git add data/candidates/timelines/2026-03-12/openai.json data/candidates/timelines/2026-03-12/anthropic.json data/candidates/timelines/2026-03-12/google-deepmind.json logs/reports/2026-03-12-timeline-search.md logs/verification/2026-03-12-timeline-search.jsonl logs/reports/2026-03-12-summary.md
git commit -m "data(search): refresh timeline candidates after review fixes"
```
