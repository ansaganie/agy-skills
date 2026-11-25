# agy-skills

Migrated open-source agent skill packs, adapted strictly for **100% compatibility with the Antigravity (`agy`) API**.

> [!NOTE]
> **Migrated skills only — no original skills are authored here.**
> Every plugin in this repository is an unofficial port of an existing open-source skill pack. Upstream workflows, prompts, and skill names are kept intact; the only modifications made are technical adaptations required for 100% compatibility with the Antigravity (`agy`) API across macOS, Linux, and Windows.

Each pack under [`plugins/`](./plugins/) is a self-contained, Marketplace-ready [Antigravity plugin](https://antigravity.google/docs/plugins) tracked against an exact upstream commit in [`upstream.json`](./upstream.json).

## Scope & Upstream Policy

- **Migrated packs only**: This repository hosts strictly ported open-source skill packs. It does not author original skills or maintain custom behavioral forks of upstream workflows.
- **Compatibility-only changes**: Modifications are limited to making upstream skills 100% compatible with the Antigravity (`agy`) API (plugin manifest, tool/subagent calls, frontmatter, rule files, and cross-platform scripts).
- **Attribution & non-affiliation**: All skill concepts, workflows, and credit belong to their respective upstream authors under their original open-source licenses. This repository provides unofficial community ports and is not affiliated with or endorsed by the upstream authors or Google/Antigravity.
- **Issues & contributions**:
  - For feedback on skill design, workflow steps, or prompt quality, please open an issue on the **upstream repository**.
  - Open an issue or PR **here** only for Antigravity (`agy`) API compatibility bugs, upstream sync updates, or porting another permissively licensed open-source skill pack.

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

## Antigravity (`agy`) API Migration Standard

Every migrated plugin in this repository adheres to the same compatibility bar:

- **Native `agy` plugin API**: Marketplace-ready `plugin.json`, bundled square SVG `logo`, 3 `suggestedPrompts`, flat `skills/<name>/SKILL.md`, and zero errors or warnings under `agy plugin validate --strict`.
- **Upstream fidelity**: Original workflow UX (for example, Matt Pocock's plain-chat grilling rounds) and original skill names are preserved with no custom workflow changes.
- **Location-independent skill activation**: Replaces Claude-only `Skill tool` calls with location-agnostic `read_file` activation (via Available Skills or sibling `../<skill>/SKILL.md`), working identically whether installed globally, workspace-scoped, or standalone.
- **Antigravity tools, frontmatter & rules**: Preserves `disable-model-invocation: true`, strips Codex-only `agents/openai.yaml`, maps subagents to `invoke_subagent`, and targets `AGENTS.md` / `GEMINI.md` instead of `CLAUDE.md`.
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
