# Matt Pocock Skills for Antigravity

An Antigravity-native plugin port of [Matt Pocock's Skills For Real Engineers](https://github.com/mattpocock/skills) (`v1.3.2`, MIT licensed).

All 27 promoted skills (`engineering` and `productivity`) are preserved with Matt Pocock's original workflow design and skill names, adapted for 100% compatibility with Google Antigravity across macOS, Linux, and Windows.

## Install

```bash
agy plugin install https://github.com/ansaganie/agy-skills/tree/main/plugins/mattpocock-skills
```

Then run `/setup-matt-pocock-skills` once in each repository where you plan to use the engineering skills.

## What Was Adapted for Antigravity

- **Plugin layout**: Flattened the 27 promoted skills into `skills/<name>/SKILL.md` with a Marketplace-ready `plugin.json` (`agy plugin validate --strict` clean).
- **Invocation model**: Preserved `disable-model-invocation: true` on all 17 user-invoked skills and removed Codex-only `agents/openai.yaml`.
- **Cross-skill activation**: Replaced Claude's `Call the Skill tool with "<name>"` instructions with location-independent `read_file` activation (via Available Skills or sibling `../<name>/SKILL.md`).
- **Subagents & rules**: Mapped subagent calls to `invoke_subagent` (fresh context windows, `TypeName="research"` for read-only work, `TypeName="self"` with `Workspace="share"`/`"branch"` for isolated edits) and steering files to `AGENTS.md` / `GEMINI.md` instead of `CLAUDE.md`.
- **Cross-platform scripts**: Bundled both bash (`.sh`, macOS/Linux) and PowerShell (`.ps1`, Windows) templates for `wizard` and `diagnosing-bugs`.

## Included Skills (27)

### Engineering — User-invoked (`/command`)

- **`/ask-matt`**: Router over the user-invoked skills and phase-boundary decisions.
- **`/grill-with-docs`**: Grilling session that also builds `GLOSSARY.md` and ADRs inline.
- **`/triage`**: Move issues through a state machine of triage roles.
- **`/improve-codebase-architecture`**: Scan a codebase for deepening opportunities, render an HTML report, and grill through your pick.
- **`/setup-matt-pocock-skills`**: Configure a repo's issue tracker, triage labels, and domain doc layout (`AGENTS.md` / `GEMINI.md`).
- **`/to-spec`**: Synthesize the current conversation into a spec and publish it to your issue tracker.
- **`/to-tickets`**: Break a plan or spec into tracer-bullet tickets with blocking edges.
- **`/implement`**: Build a spec or ticket set using `/tdd` and close out with `/code-review`.
- **`/implement-spec`**: Implement an entire spec on an integration branch with parallel implementer subagents across the ready frontier.
- **`/wayfinder`**: Plan multi-session work as a shared map of decision tickets on your issue tracker.
- **`/retro`**: Audit and improve the agent's environment after a session.

### Engineering — Model-invoked (automatic or `/command`)

- **`code-review`**: Two-axis diff review (**Standards** + **Spec**) run in parallel subagents.
- **`codebase-design`**: Shared vocabulary and patterns for deep modules and Design It Twice.
- **`diagnosing-bugs`**: Phase-gated debugging loop with cross-platform HITL templates (`.sh` + `.ps1`).
- **`domain-modeling`**: Challenge terms and maintain `GLOSSARY.md` and ADRs inline.
- **`pr`**: Structured PR descriptions (minimal visual, before/after evidence, merge-danger call).
- **`prototype`**: Throwaway logic or multi-variant UI prototypes to settle design questions.
- **`research`**: Cited primary-source investigation captured as a Markdown report.
- **`tdd`**: Vertical-slice red-green-refactor test-driven development.
- **`wizard`**: Cross-platform interactive setup wizard generator (`template.sh` + `template.ps1`).

### Productivity — User-invoked (`/command`)

- **`/grill-me`**: Relentless design-tree interview in frontier rounds.
- **`/handoff`**: Compact the current conversation into a structured handoff document.
- **`/teach`**: Multi-session stateful teaching workspace.
- **`/to-questionnaire`**: Turn an unresolved decision into a structured async or meeting questionnaire.
- **`/wait-what`**: Re-pitch an unclear message in plain English using `GLOSSARY.md` vocabulary.

### Productivity — Model-invoked (automatic or `/command`)

- **`grilling`**: The reusable design-tree interview primitive behind `grill-me`, `grill-with-docs`, `triage`, `wayfinder`, and `improve-codebase-architecture`.
- **`writing-for-agents`**: Reference for authoring skills, `AGENTS.md` / `GEMINI.md`, and pointer docs.

## Attribution & License

Original skills by **Matt Pocock** ([mattpocock/skills](https://github.com/mattpocock/skills), [AI Hero](https://www.aihero.dev)), licensed under the [MIT License](./LICENSE).
