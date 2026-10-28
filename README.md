# Orbit

Orbit is a browser-style personal dashboard built with React, TypeScript, Vite, Tailwind CSS and Motion. It keeps the existing shell, `orbit://` address bar, animated tabs, themes and persistent music player.

## Run locally

```bash
npm install
npm run dev
```

Build and lint:

```bash
npm run build
npm run lint
```

## Current features

- Solar default theme, eight additional themes, ten accent colors, custom accent and optional glass surfaces.
- Browser-style navigation, collapsible sidebar, tabs, `orbit://` routes and selectable search engine.
- Home search and editable quick-launch shortcuts.
- Orbit AI chat history stored locally. It uses Pollinations' text endpoint by default; set `VITE_AI_API_URL` to override it. Free third-party endpoints can change, rate-limit, or become unavailable.
- Community chat preview with locally saved messages. Shared messaging, real-time presence, moderation, reports and Google authentication require a configured backend.
- Audius trending/search integration and the persistent audio player.
- Internet Archive feature-film discovery and its hosted player.
- Game launcher with locally saved recents/favorites. The starter catalog is intentionally small; the requested 1,000+ catalog needs approved provider feeds and validation.
- Marketplace and profile previews with local storage.
- Settings for themes, search engine, chat filter preference, music volume, data export and clearing local data.
- Optional privacy lock screen: hold L + E + N together. Once unlocked, it stays unlocked in that browser until site data is cleared.

## Optional environment variables

Create a `.env.local` file in the project root if needed:

```env
# Override the default AI endpoint
VITE_AI_API_URL=

# Optional URL-wrapper proxy for external navigation; must contain {url}
VITE_WEB_PROXY_TEMPLATE=
```

Proxy note: a web app cannot silently configure the user's operating-system/browser proxy. `VITE_WEB_PROXY_TEMPLATE` only wraps selected external navigations through a proxy URL format you provide; it does not proxy all API traffic, guarantee anonymity, or make every third-party embed compatible. Do not put private proxy credentials in a client-side `VITE_*` variable.

## Backend and deployment still required

Base44 authentication/database entities are not connected yet. Production chat, profile sync, secure coin balances, moderation, item ownership, and multi-device recents need server-side authorization. The browser must never be trusted to award coins or grant admin powers. The full multi-provider 1,000+ games catalog also depends on provider access, licensing, and embed availability.

The project uses public third-party services (Audius, Pollinations and Internet Archive). Their uptime, CORS policy, content and availability are outside Orbit's control.
