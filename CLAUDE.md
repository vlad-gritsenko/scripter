# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Script Builder — a browser-based SPA for AI-powered video script generation. Uses vanilla HTML/CSS/JS with no build system, no frameworks, and no dependencies to install.

## Running the App

Open `index.html` directly in a browser, or serve via any static server:
```bash
python -m http.server 8000
```
No build, test, or lint commands exist. There is no package.json.

## Architecture

**Three files make up the entire app:**
- `index.html` — UI structure, loads Tailwind CSS and Google Fonts via CDN
- `script.js` — All application logic (~1060 lines, organized into 9 labeled sections)
- `style.css` — Custom styles including light/dark theme overrides and animations

**Two instruction files are loaded at runtime via fetch:**
- `STORYTELLING.txt` — JSON storytelling framework used as system prompt context
- `HOOK.txt` — JSON hook-writing instructions used as system prompt context

### Generation Pipeline

The core flow is a 3-stage AI generation pipeline, each stage potentially using a different model:
1. **Outline** — Creates a script blueprint from user's niche prompt + 5 randomizable parameters
2. **Script** — Writes the full script based on the outline
3. **Hook** — Generates a compelling opening hook

Orchestrated by `generateScript()` which calls `callOpenRouter()` for each stage sequentially.

### State Management

Single `state` object holds all app state. Persisted to localStorage using keys prefixed with `scriptBuilder_` (e.g., `scriptBuilder_templates`, `scriptBuilder_settings`, `scriptBuilder_theme`).

### Template System

Templates store per-niche configurations (prompt, script length, parameters, storytelling/hook prompts). Stored in localStorage. The "default" template cannot be deleted or renamed.

### Theme System

Dark theme is default. Light theme applies a `light-theme` class to `<body>` and overrides colors with `!important` rules in `style.css`.

### API Integration

All AI calls go through `callOpenRouter()` which POSTs to `https://openrouter.ai/api/v1/chat/completions` with Bearer token auth. Requires user to configure an OpenRouter API key in the settings modal.
