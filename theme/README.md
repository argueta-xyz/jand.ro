# Theme colors

Palette is generated at Tailwind build time from **culori** (OKLCH).

## Three roles

1. **Neutrals** — Surfaces, outlines, and gray text tokens (`background`, `surface*`, `on-background`, `primary` as UI gray, etc.). Built with **chroma 0** (achromatic OKLCH): only lightness steps, no tie to secondary hue. (A tiny chroma with `h: 0` used to read slightly warm/red on screen.)

2. **Secondary** (`THEME_SEED`) — Brand / themed UI: `secondary`, `secondary-dim`, `on-secondary`, badges, prose accents, selection, wordmark glow, blockquote border, inline code on dark, list bullets.

3. **Tertiary** (`THEME_TERTIARY_SEED`) — Second accent family, same ramp shape as secondary (`tertiary`, `tertiary-dim`, `on-tertiary`, containers, etc.). Hero highlight (e.g. “photons”) uses `text-tertiary` + `.hero-tertiary-glow`.

**Error** colors are still derived from the **secondary** seed hue (+28°) so alerts stay related to the brand.

## Environment variables

```bash
THEME_SEED='#ff453a' THEME_TERTIARY_SEED='#7eb8da' npm run css:build
```

Defaults are in `theme/colors.cjs` if env vars are unset.

## Tweaking ramps

Edit `accentFamily()` (per seed) or `neutral()` lightness steps inside `buildColors()`.

## Prose & global chrome

`src/assets/css/input.css` uses Tailwind `theme('colors.*')` for `.prose`, `body`, and selection so they track the generated tokens. Utilities `.wordmark-accent-glow` and `.hero-tertiary-glow` use `theme('colors.secondary / …')` and `theme('colors.tertiary / …')` for glows.

`tailwind.config.js` **safelists** `text-tertiary` and `hero-tertiary-glow` because those classes appear only inside HTML strings in `site.json`, which the JIT extractor does not reliably scan.
