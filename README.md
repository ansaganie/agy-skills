# agy-skills

Antigravity-native plugin ports of popular open-source agent skill packs.

Each pack under [`plugins/`](./plugins/) is a self-contained, Marketplace-ready [Antigravity plugin](https://antigravity.google/docs/plugins) adapted for 100% Antigravity compatibility across macOS, Linux, and Windows while staying faithful to each upstream author's workflow design and skill names.

## Available Plugins

| Plugin | Upstream | License | Skills | Install |
| --- | --- | --- | --- | --- |
| [**mattpocock-skills**](./plugins/mattpocock-skills/) | [mattpocock/skills](https://github.com/mattpocock/skills) (`v1.3.2`) | MIT | 27 | `agy plugin install https://github.com/ansaganie/agy-skills/tree/main/plugins/mattpocock-skills` |

## Installation

Install any plugin directly with the Antigravity CLI (`agy`):

```bash
agy plugin install https://github.com/ansaganie/agy-skills/tree/main/plugins/<plugin-name>
```

Once installed, the plugin syncs automatically across the **Antigravity CLI**, **Antigravity App**, and **Antigravity IDE** (`~/.gemini/config/plugins/<plugin-name>/`), and can be enabled, disabled, or uninstalled independently under **Customizations > Installed** or via `agy plugin enable|disable|uninstall`.

## Antigravity Migration Standard

Every plugin in this repository adheres to the same compatibility bar:

- **Native Antigravity plugin layout**: Marketplace-ready `plugin.json`, bundled square SVG `logo`, 3 `suggestedPrompts`, flat `skills/<name>/SKILL.md`, and zero warnings under `agy plugin validate --strict`.
- **Upstream fidelity**: Original workflow UX (for example, Matt Pocock's plain-chat grilling rounds) and original skill names are preserved.
- **Location-independent skill activation**: Replaces Claude-only `Skill tool` calls with location-agnostic `read_file` activation (via Available Skills or sibling `../<skill>/SKILL.md`), working identically whether installed globally, workspace-scoped, or standalone.
- **Antigravity tools & rules**: Preserves `disable-model-invocation: true`, strips Codex-only `agents/openai.yaml`, maps subagents to `invoke_subagent`, and targets `AGENTS.md` / `GEMINI.md` instead of `CLAUDE.md`.
- **Cross-platform scripts**: Script-bearing skills bundle both bash (`.sh` for macOS/Linux) and PowerShell (`.ps1` for Windows) templates and pick the right one for the user's OS.
- **Verified licenses & provenance**: Every pack's upstream URL, pinned commit SHA, version, license, and adaptation notes are tracked in [`upstream.json`](./upstream.json).

## Development & Validation

```bash
# Run portable CI validator (manifests, frontmatter, forbidden Claude/hardcoded patterns, scripts)
npm run validate

# Run Antigravity's native strict validator across every plugin
npm run validate:agy

# Run both
npm run check

# Check upstream repositories for commits ahead of pinned SHAs
npm run check-upstream
```

To sync updates from an upstream repository, run the repo-local `/sync-upstream` skill in Antigravity (defined in [`.agents/skills/sync-upstream/SKILL.md`](./.agents/skills/sync-upstream/SKILL.md)).

## License

Scaffolding, validation scripts, and sync tooling in this repository are MIT-licensed ([`LICENSE`](./LICENSE)). Each plugin under `plugins/<pack>/` carries its own upstream `LICENSE` and full author attribution.
