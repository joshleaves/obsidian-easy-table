# Obsidian Easy Table

A compact, typed table renderer for Obsidian code blocks.

`easy-table` is designed for fast data entry and better readability than default Markdown tables, especially when row names are long.

## Features

- Simple row syntax with per-line fields
- Typed value parsing:
  - `TRUE` / `FALSE` -> boolean
  - numeric values (`123`, `12.5`, `12,5`) -> number
  - `Field[]=` -> string array
  - everything else -> markdown string
- Markdown rendering inside cells
- Locale-aware number formatting via `Intl.NumberFormat`
- Compact precontent row per entry (keeps long names from bloating data columns)
- Dynamic columns inferred from fields

## Syntax

Use an `easy-table` fenced block:

```easy-table
My Milkshake
| Feature=Brings all the boys to the yards
| Good=TRUE
| Tags[]=Song,Meme
| Year=2009
| Artist=[Kelis](http://wikipedia/Kelis)
| Photo=https://example.com/photo.jpg
| Link=https://example.com/item

Your Milkshake
| Cons=It just smells bad, bro
| Good=FALSE
```

## Type Rules

### Boolean
Case-insensitive `true` / `false`:

- `TRUE` -> `✅`
- `FALSE` -> `❌`

### Number
Pattern: `-?\d+(?:[.,]\d+)?`

Examples:
- `33` -> `33`
- `12,5` -> `12.5`
- `-7.2` -> `-7.2`

Displayed using locale formatting at render time:
- default: Obsidian app language
- optional override: plugin setting `Number locale override` (for example `en-US`, `fr-FR`)

### Arrays
Keys ending in `[]` are parsed as string arrays (comma-separated):

- `Tags[]=Song,Meme` -> `["Song", "Meme"]`

Multiple array lines for the same key are merged.

### Strings
Any non-boolean/non-number value is treated as a markdown string and rendered as markdown in the cell.

## Special Field Normalization

For convenience, string values are normalized for these keys:

- `Photo=URL` -> rendered as markdown image `![](URL)`
- `Link=URL` -> rendered as markdown link `[Open](URL)`

(Values are expected to be URLs; no strict URL validation is performed.)

## Output Layout

Each logical row renders as two `<tr>` rows:

1. **Precontent row** (compact)
   - full-width cell
   - long title in single line with ellipsis
   - small metadata (row index)

2. **Content row**
   - actual data columns (`Name` + inferred fields)

## Installation (Development)

1. Build the plugin:

```bash
bun install
bun run build
```

2. Use the `dist/` folder as the plugin folder in your vault:

Artifacts produced:
- `dist/main.js`
- `dist/manifest.json`
- `dist/styles.css`
- `dist/versions.json`

3. Enable the plugin in Obsidian Community Plugins.

## Development

Watch mode:

```bash
bun run dev
```

Quality checks:

```bash
bun run lint
bun run typecheck
bun run test
```

## Project Notes

- Build system: **Vite**
- Static artifact copy: **vite-plugin-static-copy**
- Runtime target: Obsidian plugin (Electron)

## Current Scope

`easy-table` is intentionally local and parser/renderer-focused:
- no network fetchers
- no remote sync
- no cloud dependencies

## License

Add your preferred license here.
