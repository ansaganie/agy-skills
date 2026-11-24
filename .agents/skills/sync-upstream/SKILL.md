---
name: sync-upstream
description: Sync one or more plugin packs in agy-skills with their upstream GitHub repositories while preserving Antigravity adaptations.
disable-model-invocation: true
---

# Sync Upstream Skill Packs

Port upstream changes into `plugins/<pack>/` while preserving every Antigravity adaptation documented in `AGENTS.md` and `upstream.json`.

## Steps

1. **Check for upstream updates**: Run `npm run check-upstream` to see which packs have commits ahead of their pinned SHA in `upstream.json`. If the user named a specific pack, focus on that pack.
2. **Inspect the upstream diff**: Clone or fetch the upstream repo into a temporary directory (outside this repo) and inspect `git log <pinned>..origin/<branch> --oneline` and `git diff <pinned>..origin/<branch>` scoped to the pack's `sourcePaths` in `upstream.json`.
3. **Summarize changes before editing**: Present a brief list of added, modified, or removed skills and note any upstream license or version bump. Confirm with the user if any breaking rename or removal occurred.
4. **Port changes cleanly**:
   - Apply upstream edits into `plugins/<pack>/skills/<name>/`.
   - Preserve all Antigravity adaptations from `AGENTS.md` and `upstream.json`:
     - Keep `disable-model-invocation: true` on user-invoked skills; strip Codex-only `agents/openai.yaml`.
     - Replace Claude `Skill tool` references with location-independent `read_file` activation (`from Available Skills or sibling ../<name>/SKILL.md`).
     - Map subagent calls to `invoke_subagent` and steering files to `AGENTS.md` / `GEMINI.md`.
     - Maintain dual `.sh` + `.ps1` templates for any script-bearing skills (`wizard`, `diagnosing-bugs`).
   - Update `plugins/<pack>/plugin.json` (`version`), `plugins/<pack>/README.md` (skill list/version if changed), root `README.md`, and `upstream.json` (`commit`, `version`).
5. **Validate**:
   - Run `npm run validate` and `npm run validate:agy`.
   - Fix any errors or `--strict` warnings before finishing.
6. **Report**: Summarize ported commits, updated version/SHA, and validation output.
