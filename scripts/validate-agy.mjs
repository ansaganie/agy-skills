import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const ROOT = path.resolve(import.meta.dirname, "..");
const PLUGINS_DIR = path.join(ROOT, "plugins");

const packs = fs
  .readdirSync(PLUGINS_DIR, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort();

let failed = false;

for (const pack of packs) {
  const dir = path.join(PLUGINS_DIR, pack);
  const cmd = process.platform === "win32" ? "agy.exe" : "agy";
  const res = spawnSync(cmd, ["plugin", "validate", "--strict", dir], {
    stdio: "inherit",
  });
  if (res.error) {
    console.error(`Failed to run "agy": ${res.error.message}`);
    process.exit(1);
  }
  if (res.status !== 0) {
    failed = true;
  }
}

if (failed) {
  process.exit(1);
}

console.log(`\n✔ agy plugin validate --strict passed for ${packs.length} plugin(s).`);
