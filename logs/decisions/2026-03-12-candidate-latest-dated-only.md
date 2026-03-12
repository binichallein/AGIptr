# Decision: Candidate Latest Requires A Valid Release Date

## Date

2026-03-12

## Context

The timeline search agent emits candidate models before promotion into curated truth.

Some candidate models are discovered from official pages but do not yet have a stable release date extracted from those pages.

If undated candidates are allowed to win `latest_candidate`, the report can falsely claim a latest model based purely on incidental ordering.

## Decision

Only assign `latest_candidate=true` to the newest candidate that has a valid `release_date_candidate`.

If a candidate has no valid release date:

- it may still appear in the candidate timeline
- it may still carry evidence for later review
- it must not become the candidate-layer latest model

## Consequence

- candidate reports stay conservative
- undated but plausible new models remain visible without being overstated
- unresolved latest-model ambiguity must be addressed by stronger evidence or manual promotion review
