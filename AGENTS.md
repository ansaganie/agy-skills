# AGENTS.md

This repository maintains **migrated-only**, Antigravity-native plugin ports of popular open-source agent skill packs, adapted strictly for **100% compatibility with the Antigravity (`agy`) API**. No original skills are authored here, and no behavioral or workflow forks are introduced beyond technical `agy` API compatibility.

## Repository Layout

- `plugins/<pack>/`: One self-contained Antigravity plugin per skill pack (`plugin.json`, `README.md`, `LICENSE`, `assets/logo.svg`, `skills/<skill>/SKILL.md`).
- `upstream.json`: Single source of truth for the pack catalog and upstream provenance (upstream URL, branch, pinned commit SHA, version, license, and adaptation notes). Keep metadata here rather than adding extra non-plugin files inside `plugins/<pack>/`.
- `scripts/validate.mjs`: Portable zero-dependency validator (runs in CI and locally via `npm run validate`).
- `scripts/validate-agy.mjs`: Runs `agy plugin validate --strict` against every plugin under `plugins/` (`npm run validate:agy`).
- `scripts/check-upstream.mjs`: Checks each pack's upstream GitHub repo for commits ahead of its pinned SHA (`npm run check-upstream`).

## Migration Standard

Every plugin under `plugins/<pack>/` must satisfy these rules:

1. **Migrated-only scope & verified open-source license**: Only port existing open-source packs whose upstream license explicitly permits public redistribution. Do not author original skills or alter upstream workflows beyond `agy` API compatibility. Preserve upstream attribution in `README.md` and `plugin.json`, include the upstream `LICENSE`, and include a clear migrated-port / non-affiliation / `agy` API compatibility notice (plus upstream vs. port issue routing) in each plugin's `README.md`.
2. **Upstream UX and naming fidelity**: Keep original workflow UX (e.g., plain-chat grilling rounds) and original skill names. Adapt only what is needed for 100% Antigravity (`agy`) API technical compatibility.
3. **Location-independent skill activation**: Never hardcode `~/.gemini/config/skills/...` or Claude's `Skill tool`. Instruct the agent to activate another skill by reading its `SKILL.md` from the Available Skills list (or sibling `../<skill-name>/SKILL.md`) with `read_file`.
4. **Antigravity tool & rule conventions**:
   - Keep `disable-model-invocation: true` for user-invoked skills; strip harness-only metadata like `agents/openai.yaml`.
   - Map subagent calls to `invoke_subagent` (fresh context by default; use `TypeName="research"` for read-only analysis and `TypeName="self"` with `Workspace="share"` or `"branch"` for parallel edits).
   - Reference `AGENTS.md` / `GEMINI.md` rather than `CLAUDE.md` as project rule files.
5. **Cross-platform scripts**: Script-bearing skills must support macOS/Linux (`.sh`) AND Windows (`.ps1`) and instruct the agent to pick the template matching the user's OS.
6. **Strict validation**: Every change must pass `npm run validate` and (when `agy` CLI is available) `npm run validate:agy` with zero errors and zero warnings.
