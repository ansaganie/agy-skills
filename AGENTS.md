# AGENTS.md

This repository maintains Antigravity-native plugin ports of popular open-source agent skill packs.

## Repository Layout

- `plugins/<pack>/`: One self-contained Antigravity plugin per skill pack (`plugin.json`, `README.md`, `LICENSE`, `assets/logo.svg`, `skills/<skill>/SKILL.md`).
- `upstream.json`: Single source of truth for the pack catalog and upstream provenance (upstream URL, branch, pinned commit SHA, version, license, and adaptation notes). Keep metadata here rather than adding extra non-plugin files inside `plugins/<pack>/`.
- `scripts/validate.mjs`: Portable zero-dependency validator (runs in CI and locally via `npm run validate`).
- `scripts/validate-agy.mjs`: Runs `agy plugin validate --strict` against every plugin under `plugins/` (`npm run validate:agy`).
- `scripts/check-upstream.mjs`: Checks each pack's upstream GitHub repo for commits ahead of its pinned SHA (`npm run check-upstream`).

## Migration Standard

Every plugin under `plugins/<pack>/` must satisfy these rules:

1. **Verified open-source license**: Only port packs whose upstream license explicitly permits public redistribution. Preserve upstream attribution in `README.md` and `plugin.json`, and include the upstream `LICENSE`.
2. **Upstream UX and naming fidelity**: Keep original workflow UX (e.g., plain-chat grilling rounds) and original skill names. Adapt only what is needed for 100% Antigravity technical compatibility.
3. **Location-independent skill activation**: Never hardcode `~/.gemini/config/skills/...` or Claude's `Skill tool`. Instruct the agent to activate another skill by reading its `SKILL.md` from the Available Skills list (or sibling `../<skill-name>/SKILL.md`) with `read_file`.
4. **Antigravity tool & rule conventions**:
   - Keep `disable-model-invocation: true` for user-invoked skills; strip harness-only metadata like `agents/openai.yaml`.
   - Map subagent calls to `invoke_subagent` (fresh context by default; use `TypeName="research"` for read-only analysis and `TypeName="self"` with `Workspace="share"` or `"branch"` for parallel edits).
   - Reference `AGENTS.md` / `GEMINI.md` rather than `CLAUDE.md` as project rule files.
5. **Cross-platform scripts**: Script-bearing skills must support macOS/Linux (`.sh`) AND Windows (`.ps1`) and instruct the agent to pick the template matching the user's OS.
6. **Strict validation**: Every change must pass `npm run validate` and (when `agy` CLI is available) `npm run validate:agy` with zero errors and zero warnings.
