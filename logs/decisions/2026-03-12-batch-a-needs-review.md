# Decision: Keep Batch-A Vendors At `needs_review`

## Date

2026-03-12

## Context

Batch-a now has curated official-source overlays for:

- `openai`
- `anthropic`
- `google-deepmind`
- `alibaba`

The overlays add explicit source URLs, batch assignment, and model-level verification for core hard facts.

## Decision

Do not mark any batch-a vendor as `verified` yet.

Keep vendor status at `needs_review` until both conditions are true:

1. every model displayed under that vendor has acceptable official evidence for the fields shown on the page
2. the remaining vendor-specific gaps are closed

## Reasons

- OpenAI still carries a `GPT-3.5` record whose exact product mapping is not strong enough for vendor-level `verified`
- Anthropic and Google DeepMind now have correct latest models, but page-display fields such as `architecture`, `type`, and `family` still include unsourced legacy taxonomy
- Alibaba/Qwen is too large to upgrade directly to vendor-level `verified` without a dedicated adapter and explicit parent-child curation

## Consequence

- `staging` generation is allowed
- `release` generation is blocked
- batch progress is visible in verification logs without falsely claiming vendor-level completion
