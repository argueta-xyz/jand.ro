'use strict';

const { formatHex, oklch, parse, clampChroma } = require('culori');

const THEME_SEED = process.env.THEME_SEED || '#ff453a';
const THEME_TERTIARY_SEED = process.env.THEME_TERTIARY_SEED || '#607b8b';

function clampL(l) {
  return Math.min(1, Math.max(0, l));
}

function normH(h) {
  return ((h % 360) + 360) % 360;
}

function hexFromOklch(l, c, h) {
  return formatHex(
    clampChroma({
      mode: 'oklch',
      l: clampL(l),
      c: Math.max(0, c),
      h: normH(h),
    }),
  );
}

function neutral(l, c = 0) {
  return hexFromOklch(l, c, 0);
}

function accentFamily(seedHex) {
  const base = oklch(parse(seedHex));
  const h0 = base.h ?? 0;
  const l0 = base.l;
  const c0 = base.c;

  const tone = (l, multC = 1, dh = 0) =>
    hexFromOklch(clampL(l), c0 * multC, h0 + dh);

  return {
    main: formatHex(base),
    dim: tone(l0 - 0.04, 0.92, 0),
    fixed: tone(l0 + 0.32, 0.35, 0),
    fixedDim: tone(l0 + 0.22, 0.42, 0),
    container: tone(l0 - 0.22, 0.55, 0),
    onMain: hexFromOklch(0.22, 0.05, h0),
    onContainer: tone(l0 + 0.18, 0.55, 0),
    onFixed: hexFromOklch(0.28, 0.12, h0),
    onFixedVariant: tone(l0 - 0.12, 0.75, 0),
    h: h0,
  };
}

function buildColors(secondarySeed, tertiarySeed) {
  const sec = accentFamily(secondarySeed);
  const ter = accentFamily(tertiarySeed);
  const errH = sec.h + 28;
  const e = (l, c = 0.17) => hexFromOklch(l, c, errH);

  const n = neutral;

  return {
    'surface-container-lowest': '#000000',
    background: n(0.12),
    surface: n(0.12),
    'surface-dim': n(0.12),
    'surface-container': n(0.16),
    'surface-container-low': n(0.15),
    'surface-container-high': n(0.19),
    'surface-container-highest': n(0.22),
    'surface-variant': n(0.24),
    'surface-bright': n(0.28),
    'surface-tint': n(0.78),

    primary: n(0.8),
    'primary-dim': n(0.72),
    'primary-container': n(0.32),
    'on-primary': n(0.22),
    'on-primary-container': n(0.84),
    'primary-fixed': n(0.9),
    'primary-fixed-dim': n(0.82),
    'on-primary-fixed': n(0.22),
    'on-primary-fixed-variant': n(0.38),
    'inverse-primary': n(0.42),

    secondary: sec.main,
    'secondary-dim': sec.dim,
    'secondary-fixed': sec.fixed,
    'secondary-fixed-dim': sec.fixedDim,
    'secondary-container': sec.container,
    'on-secondary': sec.onMain,
    'on-secondary-container': sec.onContainer,
    'on-secondary-fixed': sec.onFixed,
    'on-secondary-fixed-variant': sec.onFixedVariant,

    tertiary: ter.main,
    'tertiary-dim': ter.dim,
    'tertiary-fixed': ter.fixed,
    'tertiary-fixed-dim': ter.fixedDim,
    'tertiary-container': ter.container,
    'on-tertiary': ter.onMain,
    'on-tertiary-container': ter.onContainer,
    'on-tertiary-fixed': ter.onFixed,
    'on-tertiary-fixed-variant': ter.onFixedVariant,

    'on-background': n(0.93),
    'on-surface': n(0.93),
    'on-surface-variant': n(0.72),
    outline: n(0.48),
    'outline-variant': n(0.32),

    error: e(0.68, 0.19),
    'error-dim': e(0.58, 0.16),
    'error-container': e(0.38, 0.12),
    'on-error': hexFromOklch(0.2, 0.06, errH),
    'on-error-container': e(0.82, 0.12),

    'inverse-surface': n(0.96),
    'inverse-on-surface': n(0.38),
  };
}

module.exports = buildColors(THEME_SEED, THEME_TERTIARY_SEED);
