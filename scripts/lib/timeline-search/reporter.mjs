function canonicalModelsForVendor(canonicalDataset, vendorId) {
  return (canonicalDataset?.models || []).filter((model) => model.vendorId === vendorId);
}

export function diffTimelineCandidatesAgainstCanonical({ vendorId, candidates, canonicalDataset }) {
  const canonicalModels = canonicalModelsForVendor(canonicalDataset, vendorId);
  const canonicalById = new Map(canonicalModels.map((model) => [model.id, model]));
  const added = [];
  const releaseDateChanges = [];
  const conflicts = [];

  for (const candidate of candidates || []) {
    if (candidate.conflict_flags?.length) {
      conflicts.push(candidate);
    }

    const existing = canonicalById.get(candidate.model_id_candidate);
    if (!existing) {
      added.push(candidate);
      continue;
    }

    if (candidate.release_date_candidate && candidate.release_date_candidate !== existing.releaseDate) {
      releaseDateChanges.push({
        model_id_candidate: candidate.model_id_candidate,
        previous: existing.releaseDate,
        next: candidate.release_date_candidate
      });
    }
  }

  const previousLatest = canonicalModels.find((model) => model.isLatestPrimary);
  const nextLatest = (candidates || []).find((candidate) => candidate.latest_candidate);
  const latestModelChange =
    previousLatest && nextLatest && previousLatest.id !== nextLatest.model_id_candidate
      ? {
          previous: {
            modelId: previousLatest.id,
            modelName: previousLatest.name
          },
          next: {
            modelId: nextLatest.model_id_candidate,
            modelName: nextLatest.model_name
          }
        }
      : null;

  return {
    vendorId,
    added,
    releaseDateChanges,
    latestModelChange,
    conflicts
  };
}

export function renderTimelineDiffReport({ runDate, vendorDiffs }) {
  const lines = [`# Timeline Search Report`, "", `- Date: ${runDate}`];

  for (const diff of vendorDiffs || []) {
    lines.push("", `## ${diff.vendorId}`, "");
    lines.push(`- Added models: ${diff.added.length}`);
    lines.push(`- Release-date changes: ${diff.releaseDateChanges.length}`);
    lines.push(`- Conflicts: ${diff.conflicts.length}`);

    if (diff.latestModelChange) {
      lines.push(
        `- Latest change: ${diff.latestModelChange.previous.modelId} -> ${diff.latestModelChange.next.modelId}`
      );
    }

    diff.conflicts.forEach((candidate) => {
      lines.push(`- Conflict: ${candidate.model_name} [${candidate.conflict_flags.join(", ")}]`);
    });
  }

  return `${lines.join("\n")}\n`;
}
