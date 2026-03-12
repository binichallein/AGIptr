import fs from "node:fs/promises";
import path from "node:path";

export async function loadTimelineVendorConfig(repoRoot) {
  const filePath = path.join(repoRoot, "config/search-agents/timeline-vendors.json");
  return JSON.parse(await fs.readFile(filePath, "utf8"));
}
