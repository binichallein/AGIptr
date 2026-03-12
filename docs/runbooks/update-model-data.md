# Update Model Data Runbook

This runbook is written for future AI maintainers.

## Goal

Update AGIptr data without reintroducing dual data sources or undocumented manual edits.

## Rules

- Work on a feature branch, not `main`
- Use small commits
- Do not hand-edit `data/generated/*`
- Leave AI-readable logs for every non-trivial decision

## Standard Flow

1. Review current canonical state

```bash
node --test tests/site-data.test.mjs
node scripts/verify-site-data.mjs
```

2. Decide update mode

- If you are only changing import logic, edit scripts/lib or import scripts
- If you are curating explicit canonical truth, edit `data/canonical/site-data.json`
- If you need to preserve a judgment call, add a decision file under `logs/decisions/`

3. Rebuild generated artifacts

```bash
node scripts/import-legacy-data.mjs
node scripts/generate-site-data.mjs
node scripts/verify-site-data.mjs
```

4. Validate frontend entrypoints

```bash
node --check index.js
node --check detail.js
```

5. Validate single-source consistency

```bash
node <<'NODE'
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('data/generated/site-data.json', 'utf8'));
const mismatches = [];
for (const vendor of data.vendors) {
  const latest = data.latestPrimaryModels[vendor.id];
  const detailLatest = (data.vendorDetails[vendor.id]?.models || [])[0] || null;
  if (!latest || !detailLatest || latest.id !== detailLatest.id || latest.releaseDate !== detailLatest.releaseDate) {
    mismatches.push(vendor.id);
  }
}
if (mismatches.length) {
  console.error(`Mismatched vendors: ${mismatches.join(', ')}`);
  process.exit(1);
}
NODE
```

6. Write logs

- update or create `logs/reports/YYYY-MM-DD-summary.md`
- add a decision record if any transformation is not self-evident

7. Commit with structure

Commit title examples:

- `data(openai): reconcile release dates against official release notes`
- `fix(import): preserve orphan variants as explicit primaries`
- `docs(runbook): document canonical verification flow`

Commit body must include:

- goal
- scope
- source
- verification
- open issues

## Current Known Gap

The present canonical dataset is still seeded from legacy repository data.

That means:

- the runtime is single-source
- the runtime is internally consistent
- the dataset is not yet fully upgraded to official source URLs

When you start official-source curation, preserve that distinction in logs and commit messages.
