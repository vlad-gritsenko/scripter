# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## Project Overview

Scripter — a niche-based video script generation SPA. Vanilla HTML/CSS/JS frontend deployed on Cloudflare Pages. Backend is Cloudflare Pages Functions that act as a secure proxy to OpenRouter, keeping prompts and API keys off the client.

## Running Locally

```bash
# Requires Cloudflare Wrangler CLI
npx wrangler pages dev .
```

This serves both the static files and the Pages Functions at `http://localhost:8788`.

For local dev, open Settings in the app and set the API Endpoint to `http://localhost:8788` (or leave empty if wrangler is serving everything).

**Note:** You must set environment variable secrets locally with:
```bash
npx wrangler pages dev . --binding OPENROUTER_API_KEY=sk-or-...
```

Or create a `.dev.vars` file (gitignored) with:
```
OPENROUTER_API_KEY=sk-or-...
NICHE_WEAPONS_PROMPT=<your weapons master prompt with {{PLACEHOLDER}} tokens>
STORYTELLING_PROMPT=<storytelling framework>
HOOK_PROMPT=<hook writing instructions>
ANTIPATTERN_PROMPT=<AI slop removal instructions>
```

## Architecture

**Client (static files):**
- `index.html` — UI: fixed sidebar + scrollable main content
- `script.js` — App logic: niche system, dynamic forms, 2-stage pipeline, streaming
- `style.css` — Styles: sidebar layout, themes, content display

**Backend (Cloudflare Pages Functions):**
- `functions/api/niches.js` — GET endpoint: returns niche schemas (no prompt text)
- `functions/api/generate.js` — POST endpoint: assembles prompts from env vars, proxies to OpenRouter

## Security Model

Prompts are NEVER stored in the client code. They live as encrypted environment variables in the Cloudflare Pages dashboard:

| Variable | Description |
|---|---|
| `OPENROUTER_API_KEY` | OpenRouter API key |
| `NICHE_WEAPONS_PROMPT` | Master prompt for Weapons niche (with `{{PLACEHOLDER}}` tokens) |
| `STORYTELLING_PROMPT` | Storytelling framework injected as system context |
| `HOOK_PROMPT` | Hook writing principles injected as system context |
| `ANTIPATTERN_PROMPT` | AI slop removal instructions for the Polish stage |

## Generation Pipeline

Two-stage pipeline:

1. **Write** (Claude Opus 4.6, temp ~0.8): Client sends `{ niche, placeholders, stage: "write" }` → Function substitutes `{{PLACEHOLDER}}` tokens into master prompt → calls OpenRouter → streams response
2. **Polish** (Claude Sonnet 4.6, temp ~0.3): Client sends `{ draft, stage: "clean" }` → Function applies antipattern prompt → calls OpenRouter → streams cleaned response

## Niche System

Each niche is defined in `functions/api/niches.js` as a schema object. The schema only contains:
- Niche ID, name, icon
- Placeholder definitions (type, label, options for dropdowns)

The actual master prompt lives in an env var (`NICHE_WEAPONS_PROMPT`), never in the schema.

**Adding a new niche:**
1. Add schema entry to `NICHES` array in `functions/api/niches.js`
2. Add a prompt key to `NICHE_PROMPT_KEYS` in `functions/api/generate.js`
3. Set the env var in Cloudflare Pages dashboard
4. Zero client changes needed — the sidebar and form adapt automatically

## Placeholder Format

Master prompts use `{{PLACEHOLDER_NAME}}` syntax:
```
Write a script about {{WEAPON_NAME}} from {{ERA_OF_CONFLICT}}.
Use a {{HOOK_TYPE}} hook and {{STRUCTURE_TYPE}} structure.
Sources: {{SOURCE_LINKS}}
```

## State Management

Single `state` object. localStorage keys (prefix `scripter_`):
- `scripter_theme` — dark/light
- `scripter_currentNiche` — last selected niche ID
- `scripter_formValues_{nicheId}` — saved form values per niche
- `scripter_settings` — API endpoint URL, temperatures

## Deploying to Cloudflare Pages

1. Push repo to GitHub
2. Connect to Cloudflare Pages (Build settings: no build command, output directory `/`)
3. Set environment variables in Pages dashboard → Settings → Environment variables
4. Deploy
