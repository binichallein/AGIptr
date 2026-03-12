import fs from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";

export async function loadLegacySiteData(repoRoot) {
  const context = {
    window: {},
    console
  };
  vm.createContext(context);

  for (const fileName of ["model-data.js", "vendor-data.js"]) {
    const filePath = path.join(repoRoot, fileName);
    const source = await fs.readFile(filePath, "utf8");
    vm.runInContext(source, context, { filename: fileName });
  }

  return {
    vendors: context.window.AGIptrVendors || [],
    models: context.window.AGIptrModels || [],
    vendorDetails: context.window.AGIptrVendorDetails || {}
  };
}
