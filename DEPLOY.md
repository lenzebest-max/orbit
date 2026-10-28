# Orbit — combined frontend + Base44 backend package

This branch packages the Orbit React/Vite frontend with the entity schemas exported from the existing Base44 app.

- Frontend source: `src/`
- Base44 entity schema backup/reference: `base44/entities/`
- Connected Base44 app ID: `6ae264e1908dafdc6991d163`
- The live database/auth backend remains hosted by Base44. The JSONC schemas in this ZIP are a portable copy/reference; they do not run as a standalone database server.

## Run locally

1. Install Node.js 20 or newer.
2. Copy `.env.example` to `.env.local`.
3. Keep `VITE_BASE44_APP_ID=6ae264e1908dafdc6991d163` unless you intentionally switch to another Base44 app.
4. Run:

   ```bash
   npm install
   npm run dev
   ```

## Deploy the frontend

Build command: `npm run build`

Output directory: `dist`

Deploy the `dist` directory to a static host such as Vercel, Netlify, Cloudflare Pages, or GitHub Pages. For client-side routes, configure the host to rewrite unknown paths to `/index.html`.

Set these build environment variables in the host:

- `VITE_BASE44_APP_ID=6ae264e1908dafdc6991d163`
- `VITE_WEB_PROXY_TEMPLATE` only if you have deployed and control a compatible proxy. Leave it unset otherwise; do not use random public/open proxies.

## Google sign-in and backend

The frontend uses `@base44/sdk` and the existing Base44 app. Before production, open the Base44 app settings and confirm Google provider authentication is enabled and the deployed domain/redirect URL is allowed. Never put Base44 personal API keys, OAuth client secrets, or other private credentials in `VITE_*` variables.

Profile and community chat already call Base44 entities from the frontend. Other screens that currently use browser-local storage remain local until their UI is explicitly connected to backend operations and the corresponding entity permissions/server-side validation are configured. In particular, never implement wallet purchases by trusting a client-supplied balance or price.

## What is included

- Orbit React/Vite app source and its existing lockfile
- Base44 SDK dependency and app ID connection
- Base44 entity schema copies for channels, game activity, inventory, messages, playlists, profiles, reports, servers, shop items, and wallets
- Deployment environment example and this guide

Dependencies are not bundled; install them with `npm install` after extracting the ZIP.
