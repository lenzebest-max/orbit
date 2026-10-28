# Orbit

Orbit is a browser-style personal dashboard built with React, TypeScript, Vite, Tailwind CSS and Motion. It includes a custom browser shell, `orbit://` navigation, animated tabs, themes and a persistent music player.

## Run locally

1. Install [Node.js LTS](https://nodejs.org/en/download).
2. Open a terminal in the extracted repository folder.
3. Run:

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`). Keep the terminal open while using the app.

Build and lint:

```bash
npm run build
npm run lint
```

## Implemented

- Fictional wellness-portal entry screen before the Orbit workspace.
- Solar theme, eight additional themes, ten accent colors, custom accent and optional glass surfaces.
- Browser-style navigation, collapsible sidebar, tabs, `orbit://` routes and selectable search engine.
- Orbit starfield home, web search and editable quick-launch shortcuts.
- Orbit AI chat history stored locally; Pollinations text endpoint by default, overridable with `VITE_AI_API_URL`.
- Local community-chat preview with saved messages; shared live chat and moderation still require server integration.
- Audius track discovery/search and streaming through the persistent player when the service permits access.
- Internet Archive film discovery and its hosted player.
- Game launcher with category filters, favorites, recents, a playable built-in 2048 game and Tic-Tac-Toe, plus external game links with an open-in-new-tab fallback.
- Profile editor with optional Base44 Google authentication/profile sync, depending on Base44 app configuration and permissions.
- Marketplace preview, local cosmetics/coin state and settings for themes, search engine, chat filter preference, music volume, data export and clearing local data.

## Optional environment variables

Create a `.env.local` file in the project root:

```env
# Override the default AI endpoint
VITE_AI_API_URL=

# Optional approved game catalog endpoint. Expected JSON array or { "games": [...] }.
# Each game should include id, title/name, category/genre, url/embedUrl/gameUrl, and image/thumbnail/cover.
VITE_GAME_CATALOG_URL=

# Optional URL-wrapper proxy template containing the literal {url} placeholder.
VITE_WEB_PROXY_TEMPLATE=
```

Do not put private proxy credentials in client-side `VITE_*` variables. The optional URL wrapper only routes selected navigations through a compatible URL template; it does not proxy all API traffic or guarantee anonymity.

## Integrations still requiring setup

- The external provider game catalog currently has a small built-in starter list. A validated 1,000+ game library requires an approved catalog feed, image URLs and playable embed URLs. Some game sites block iframes, so the external-tab fallback is intentional.
- Base44 schemas and the profile sign-in integration are present, but real-time shared chat, message moderation/report handling, multi-device favorites, shop inventory sync, and secure server-side coin rewards still need backend functions and tested permissions.
- The marketplace's displayed coins are a local preview, not a secure currency balance.
- Google OAuth, Base44 app permissions, and hosting settings must be enabled in the corresponding provider dashboard.
- GitHub Pages deployment workflow is included; enable Pages for the repository with GitHub Actions as the build/deployment source if it is not already enabled.

Orbit uses public third-party services (Audius, Pollinations and Internet Archive). Their uptime, CORS policies, content, and availability are outside Orbit's control.
