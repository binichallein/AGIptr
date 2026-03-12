import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { buildGeneratedSiteData } from "./lib/site-data.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const args = process.argv.slice(2);
const modeArg = args.find((argument) => argument.startsWith("--mode="));
const mode = modeArg ? modeArg.split("=")[1] : "staging";

async function main() {
  const canonicalPath = path.join(repoRoot, "data/canonical/site-data.json");
  const generatedJsonPath = path.join(repoRoot, "data/generated/site-data.json");
  const generatedJsPath = path.join(repoRoot, "data/generated/site-data.js");
  const canonical = JSON.parse(await fs.readFile(canonicalPath, "utf8"));
  const generated = buildGeneratedSiteData(canonical, { mode });

  await fs.writeFile(generatedJsonPath, `${JSON.stringify(generated, null, 2)}\n`, "utf8");
  await fs.writeFile(
    generatedJsPath,
    `window.AGIptrSiteData = ${JSON.stringify(generated, null, 2)};\n`,
    "utf8"
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
