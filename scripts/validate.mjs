import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const PLUGINS_DIR = path.join(ROOT, "plugins");
const UPSTREAM_PATH = path.join(ROOT, "upstream.json");

const ALLOWED_PLUGIN_KEYS = new Set([
  "$schema",
  "name",
  "displayName",
  "description",
  "version",
  "disabled",
  "logo",
  "suggestedPrompts",
  "skills",
  "author",
  "homepage",
  "repository",
  "license",
  "keywords",
  "extensions",
]);

const ALLOWED_LOGO_EXTS = new Set([".svg", ".png", ".jpg", ".jpeg", ".webp"]);
const DISALLOWED_BRAND_PREFIX = /^(antigravity|gemini|claude|cursor)\b/i;
const KEBAB_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

const FORBIDDEN_PATTERNS = [
  { re: /\bSkill tool\b/, message: 'Found Claude-specific "Skill tool" reference (use read_file activation)' },
  { re: /\bCLAUDE\.md\b/, message: 'Found "CLAUDE.md" reference (use AGENTS.md / GEMINI.md)' },
  { re: /~\/\.gemini\/config\/skills\b|\.gemini\/config\/skills\b/, message: "Found hardcoded ~/.gemini/config/skills path (must be location-independent)" },
  { re: /\bAskUserQuestion\b/, message: 'Found Claude-specific "AskUserQuestion" reference' },
];

const errors = [];

function fail(file, message) {
  const rel = path.relative(ROOT, file).replace(/\\/g, "/");
  errors.push(`${rel}: ${message}`);
}

function walkFiles(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walkFiles(full));
    } else {
      out.push(full);
    }
  }
  return out;
}

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) return null;
  const raw = match[1];
  const fields = {};
  const lines = raw.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim() || line.trim().startsWith("#")) continue;
    const kv = line.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/);
    if (!kv) continue;
    const [, key, rest] = kv;
    let value = rest.trim();
    if (value === ">" || value === ">-" || value === "|" || value === "|-") {
      const block = [];
      while (i + 1 < lines.length && /^[ \t]+/.test(lines[i + 1])) {
        i++;
        block.push(lines[i].trim());
      }
      value = block.join(" ");
    } else if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    fields[key] = value;
  }
  return fields;
}

function validateRelativeLinks(mdFile, content) {
  // Strip fenced code blocks so example snippets aren't treated as links.
  const stripped = content.replace(/```[\s\S]*?```/g, "");
  const linkRe = /!?\[[^\]]*\]\(([^)]+)\)/g;
  let match;
  while ((match = linkRe.exec(stripped)) !== null) {
    const rawTarget = match[1].trim().split(/\s+/)[0];
    if (
      !rawTarget ||
      rawTarget.startsWith("#") ||
      rawTarget.startsWith("http://") ||
      rawTarget.startsWith("https://") ||
      rawTarget.startsWith("mailto:") ||
      rawTarget.startsWith("antigravity://") ||
      rawTarget.startsWith("customization://") ||
      rawTarget.includes("<") ||
      rawTarget.includes(">")
    ) {
      continue;
    }
    const cleanTarget = rawTarget.split("#")[0].split("?")[0];
    if (!cleanTarget) continue;
    const resolved = path.resolve(path.dirname(mdFile), cleanTarget);
    if (!fs.existsSync(resolved)) {
      fail(mdFile, `Broken relative link target: "${rawTarget}"`);
    }
  }
}

function validatePlugin(packName, pluginDir) {
  const manifestPath = path.join(pluginDir, "plugin.json");
  if (!fs.existsSync(manifestPath)) {
    fail(pluginDir, "Missing plugin.json");
    return;
  }

  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  } catch (err) {
    fail(manifestPath, `Invalid JSON: ${err.message}`);
    return;
  }

  for (const key of Object.keys(manifest)) {
    if (!ALLOWED_PLUGIN_KEYS.has(key)) {
      fail(manifestPath, `Unknown top-level field "${key}" (disallowed by Antigravity plugin schema)`);
    }
  }

  for (const req of ["name", "displayName", "description", "version", "logo", "author", "license"]) {
    if (!manifest[req]) {
      fail(manifestPath, `Missing required Marketplace field "${req}"`);
    }
  }

  if (manifest.name && !KEBAB_RE.test(manifest.name)) {
    fail(manifestPath, `Plugin name "${manifest.name}" must be lowercase kebab-case`);
  }
  if (manifest.name && manifest.name !== packName) {
    fail(manifestPath, `Plugin name "${manifest.name}" must match folder name "${packName}"`);
  }
  if (manifest.name && DISALLOWED_BRAND_PREFIX.test(manifest.name)) {
    fail(manifestPath, `Plugin name "${manifest.name}" must not start with Antigravity/Gemini/Claude/Cursor`);
  }
  if (manifest.displayName && DISALLOWED_BRAND_PREFIX.test(manifest.displayName)) {
    fail(manifestPath, `displayName "${manifest.displayName}" must not start with Antigravity/Gemini/Claude/Cursor`);
  }

  if (manifest.logo) {
    const ext = path.extname(manifest.logo).toLowerCase();
    if (!ALLOWED_LOGO_EXTS.has(ext)) {
      fail(manifestPath, `Unsupported logo extension "${ext}"`);
    }
    const logoFile = path.resolve(pluginDir, manifest.logo);
    if (!fs.existsSync(logoFile)) {
      fail(manifestPath, `Logo file does not exist: "${manifest.logo}"`);
    }
  }

  if (manifest.suggestedPrompts !== undefined) {
    if (!Array.isArray(manifest.suggestedPrompts) || manifest.suggestedPrompts.length === 0 || manifest.suggestedPrompts.length > 3) {
      fail(manifestPath, "suggestedPrompts must be an array of 1 to 3 non-empty strings");
    } else if (manifest.suggestedPrompts.some((p) => typeof p !== "string" || !p.trim())) {
      fail(manifestPath, "suggestedPrompts entries must be non-empty strings");
    }
  }

  for (const requiredFile of ["README.md", "LICENSE"]) {
    if (!fs.existsSync(path.join(pluginDir, requiredFile))) {
      fail(pluginDir, `Missing ${requiredFile}`);
    }
  }

  const skillsDir = path.join(pluginDir, "skills");
  if (!fs.existsSync(skillsDir)) {
    fail(pluginDir, "Missing skills/ directory");
    return;
  }

  const skillEntries = fs.readdirSync(skillsDir, { withFileTypes: true }).filter((e) => e.isDirectory());
  if (skillEntries.length === 0) {
    fail(skillsDir, "No skills found under skills/");
    return;
  }

  for (const skillEntry of skillEntries) {
    const skillDir = path.join(skillsDir, skillEntry.name);
    const skillMd = path.join(skillDir, "SKILL.md");
    if (!fs.existsSync(skillMd)) {
      fail(skillDir, "Missing SKILL.md");
      continue;
    }

    const content = fs.readFileSync(skillMd, "utf8");
    const fm = parseFrontmatter(content);
    if (!fm) {
      fail(skillMd, "Missing or malformed YAML frontmatter");
    } else {
      if (!fm.name) {
        fail(skillMd, 'Frontmatter missing required "name"');
      } else {
        if (!KEBAB_RE.test(fm.name) || fm.name.length > 64) {
          fail(skillMd, `Invalid skill name "${fm.name}"`);
        }
        if (fm.name !== skillEntry.name) {
          fail(skillMd, `Frontmatter name "${fm.name}" does not match folder "${skillEntry.name}"`);
        }
      }
      if (!fm.description) {
        fail(skillMd, 'Frontmatter missing required "description"');
      } else if (fm.description.length > 1024) {
        fail(skillMd, `Frontmatter description exceeds 1024 chars (${fm.description.length})`);
      }
      if (fm["disable-model-invocation"] !== undefined && !["true", "false"].includes(fm["disable-model-invocation"])) {
        fail(skillMd, `disable-model-invocation must be boolean (got "${fm["disable-model-invocation"]}")`);
      }
    }

    const allFiles = walkFiles(skillDir);
    const shFiles = [];
    for (const file of allFiles) {
      const normalized = file.replace(/\\/g, "/");
      if (normalized.endsWith("/agents/openai.yaml")) {
        fail(file, "Codex-only agents/openai.yaml should be removed");
      }
      if (file.endsWith(".sh")) {
        shFiles.push(file);
      }
      if (file.endsWith(".md")) {
        const mdText = fs.readFileSync(file, "utf8");
        for (const { re, message } of FORBIDDEN_PATTERNS) {
          if (re.test(mdText)) {
            fail(file, message);
          }
        }
        validateRelativeLinks(file, mdText);
      }
    }

    // Cross-platform script parity: every .sh template/script must have a matching .ps1 file
    for (const shFile of shFiles) {
      const ps1File = shFile.replace(/\.sh$/, ".ps1");
      if (!fs.existsSync(ps1File)) {
        fail(shFile, `Missing Windows PowerShell counterpart: ${path.basename(ps1File)}`);
      }
    }
  }
}

// 1. Validate upstream.json
if (!fs.existsSync(UPSTREAM_PATH)) {
  fail(UPSTREAM_PATH, "Missing upstream.json");
} else {
  let upstream;
  try {
    upstream = JSON.parse(fs.readFileSync(UPSTREAM_PATH, "utf8"));
  } catch (err) {
    fail(UPSTREAM_PATH, `Invalid JSON: ${err.message}`);
  }

  if (upstream) {
    const packDirs = fs
      .readdirSync(PLUGINS_DIR, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name)
      .sort();

    const registeredPacks = Object.keys(upstream.packs ?? {}).sort();

    for (const dir of packDirs) {
      if (!registeredPacks.includes(dir)) {
        fail(UPSTREAM_PATH, `Plugin "${dir}" is missing from upstream.json`);
      }
    }
    for (const packName of registeredPacks) {
      const entry = upstream.packs[packName];
      const pluginDir = path.join(ROOT, entry.pluginPath ?? `plugins/${packName}`);
      if (!fs.existsSync(pluginDir)) {
        fail(UPSTREAM_PATH, `Registered plugin "${packName}" not found at ${entry.pluginPath}`);
        continue;
      }
      for (const req of ["repo", "branch", "commit", "version", "license", "author"]) {
        if (!entry.upstream?.[req]) {
          fail(UPSTREAM_PATH, `Pack "${packName}" missing upstream.${req}`);
        }
      }
      validatePlugin(packName, pluginDir);
    }
  }
}

if (errors.length > 0) {
  console.error(`Validation failed with ${errors.length} error(s):\n`);
  for (const err of errors) {
    console.error(`  ✗ ${err}`);
  }
  process.exit(1);
}

console.log("✔ All plugins, skill frontmatter, cross-platform scripts, links, and provenance checks passed.");
