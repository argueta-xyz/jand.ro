# jand.ro

Static site: [Eleventy](https://www.11ty.dev/) + [Tailwind CSS v3](https://tailwindcss.com/) (built locally, no CDN). Fonts and icons are self-hosted; HTML loads a single `/assets/css/app.css`.

## Commands

- **`npm run build`** — copy fonts, compile CSS, clean `_site`, run Eleventy.
- **`npm run dev`** — one-off CSS build, then PostCSS watch + Eleventy serve on port 8081.

Generated files `src/assets/css/app.css` and `src/assets/fonts/*.woff2` are gitignored; CI and fresh clones must run `npm run build` (or at least `npm run css:build` before `npx eleventy`).

## VS Code

- **Tasks:** `CSS build`, `Eleventy build`, `Dev: CSS watch + Eleventy serve` (see `.vscode/tasks.json`).
- **Launch:** `Dev: Eleventy + CSS watch` / `Build: CSS + Eleventy` (see `.vscode/launch.json`).
