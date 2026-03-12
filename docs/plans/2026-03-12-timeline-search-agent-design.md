# Timeline Search Agent Design

## Date

2026-03-12

## Goal

Build a Tavily-backed search agent that discovers official-source timeline candidates for `OpenAI`, `Anthropic`, and `Google DeepMind`, including public variants across the `GPT`, `Claude`, and `Gemini` families.

## Scope

- Search only three vendors in the first version:
  - `openai`
  - `anthropic`
  - `google-deepmind`
- Cover full public timelines, not only latest models
- Include public variants such as:
  - `mini`
  - `turbo`
  - `preview`
  - `flash`
  - `opus`
  - `sonnet`
  - `haiku`
  - `thinking`
  - `pro`
  - `ultra`
  - `nano`
- Produce candidate artifacts and diff reports only
- Do not write directly into `data/curated/vendors/*.json`

## Architecture

The agent is a two-stage evidence pipeline:

1. `planner`
   - Generates vendor-specific query plans
   - Expands family names, known variants, and intent-specific searches
2. `retriever`
   - Uses Tavily only to discover candidate official pages
   - Never treats Tavily results themselves as canonical truth
3. `fetcher`
   - Fetches candidate pages and follows official-domain links up to a bounded depth
4. `extractor`
   - Pulls atomic evidence items from fetched pages
   - Stores evidence per field instead of deriving final truth directly
5. `normalizer`
   - Merges evidence into timeline candidates
   - Produces model-id candidates, release-date candidates, variant flags, and parent relations
6. `reporter`
   - Diffs candidates against current canonical data
   - Outputs markdown reports plus machine-readable logs

## Trust Model

- Tavily is a discovery layer only
- Official vendor domains are primary sources
- Non-official domains are at most secondary clues
- Candidate records may be emitted only if they have at least one official-source evidence item
- Conflicts are never auto-resolved into canonical truth

## Official Domain Policy

- `openai`: `openai.com`
- `anthropic`: `anthropic.com`
- `google-deepmind`:
  - `blog.google`
  - `developers.googleblog.com`
  - `ai.google.dev`
  - `deepmind.google`

Following links is restricted to the same vendor's official domains and bounded to two hops.

## Data Outputs

- `config/search-agents/timeline-vendors.json`
  - Vendor config, family names, variant lexicons, official domains, and query templates
- `data/candidates/timelines/YYYY-MM-DD/<vendor>.json`
  - Candidate timelines for human/AI review
- `logs/verification/YYYY-MM-DD-timeline-search.jsonl`
  - Structured search, fetch, extract, and conflict events
- `logs/reports/YYYY-MM-DD-timeline-search.md`
  - Human-readable diff and conflict summary

## Candidate Schema

Each candidate model record should include:

- `vendor_id`
- `model_name`
- `model_id_candidate`
- `family`
- `variant`
- `release_date_candidate`
- `is_primary_candidate`
- `parent_model_candidate`
- `preview_status`
- `latest_candidate`
- `supporting_evidence_ids[]`
- `confidence`
- `conflict_flags[]`

Evidence records should include:

- `evidence_id`
- `vendor_id`
- `source_url`
- `source_domain`
- `source_type`
- `officiality`
- `observed_at`
- `fact_type`
- `fact_value`
- `model_name_raw`
- `quote_snippet`
- `confidence`
- `extraction_reason`

## Conflict Rules

Conflicts must be surfaced, not hidden:

- `release_date_conflict`
- `parent_relation_unclear`
- `naming_conflict`
- `latest_claim_conflict`

Candidates with conflicts remain candidates only.

## Rollout Order

1. `openai`
2. `anthropic`
3. `google-deepmind`

This keeps the hardest naming case first and avoids overfitting to the cleaner vendors.

## Operational Constraints

- `TAVILY_API_KEY` must come from environment variables only
- No API key may be written to the repository
- Tests must avoid live network calls
- The first version should emphasize inspectability over automation

## Acceptance Criteria

- The agent runs end-to-end for all three vendors
- Candidate JSON is emitted for each vendor
- Public variants appear in the candidate layer
- Every candidate has official-source evidence
- Diff reports show additions, date changes, latest-model changes, and conflicts
- No candidate automatically mutates curated truth
