import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const ROOT = path.resolve(import.meta.dirname, "..");
const upstream = JSON.parse(fs.readFileSync(path.join(ROOT, "upstream.json"), "utf8"));

let updatesAvailable = false;

for (const [packName, config] of Object.entries(upstream.packs ?? {})) {
  const { repo, branch, commit, version } = config.upstream;
  try {
    const out = execFileSync("git", ["ls-remote", repo, `refs/heads/${branch}`], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    }).trim();
    const latest = out.split(/\s+/)[0];
    if (!latest) {
      console.error(`⚠ ${packName}: could not resolve refs/heads/${branch} on ${repo}`);
      continue;
    }
    if (latest === commit) {
      console.log(`✔ ${packName} (v${version}): up to date at ${commit.slice(0, 7)}`);
    } else {
      updatesAvailable = true;
      console.log(`↑ ${packName} (v${version}): upstream moved ${commit.slice(0, 7)} -> ${latest.slice(0, 7)}`);
      console.log(`  Compare: ${repo}/compare/${commit}...${latest}`);
    }
  } catch (err) {
    console.error(`✗ ${packName}: git ls-remote failed (${err.message.trim()})`);
    process.exitCode = 1;
  }
}

if (updatesAvailable) {
  console.log("\nRun the /sync-upstream skill to review and port upstream diffs.");
}
