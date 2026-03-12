# Decision: Promote Orphan Derived Variants During Legacy Import

## Context

The legacy repository marked many Qwen models as derived based on naming heuristics such as `-Instruct`, `-Thinking`, `-Preview`, or `-Base`.

During canonical import, some of these models had no corresponding primary parent model in the imported dataset.

## Decision

If a legacy-imported model is marked derived but no primary parent can be found, promote it to a primary model in canonical data.

## Reason

- canonical data requires explicit parent relationships
- leaving the model derived with no parent makes the graph invalid
- promoting the model preserves site visibility while keeping the data internally consistent
- this is safer than silently dropping the model

## Follow-up

When official-source curation is added, revisit promoted records and either:

- connect them to a verified primary parent, or
- confirm that the promoted model is truly the correct primary runtime record
