// lib/theme-utils.ts
import { oklch as toOKLCH, formatCss } from "culori";

import Cookies from "js-cookie";

/** Steps -> OKLCH lightness values; tweak if you want a different ramp */
const LIGHTNESS_STEPS: Record<string, number> = {
  "50": 0.98,
  "100": 0.96,
  "200": 0.92,
  "300": 0.86,
  "400": 0.78,
  "500": 0.72,
  "600": 0.64,
  "700": 0.55,
  "800": 0.45,
  "900": 0.35,
};

export type Scale = Record<string, string>; // e.g. { "50": "oklch(...)", ... }
export type ThemePayload = {
  primary?: Scale;
  secondary?: Scale;
  // neutrals?: Scale; // optional if you ever add neutrals
};

/** Build a full 50..900 OKLCH scale from a single base hex color */
export function makeScaleFromBase(baseHex: string, opts?: { chroma?: number }) {
  const base = toOKLCH(baseHex);
  // Use base hue; choose a moderate chroma if missing, or clamp with opts
  const h = base?.h ?? 270;
  const c = Math.max(0, opts?.chroma ?? base?.c ?? 0.1);

  const out: Scale = {};
  for (const [step, l] of Object.entries(LIGHTNESS_STEPS)) {
    out[step] = formatCss({ mode: "oklch", l, c, h } as any); // "oklch(l c h)"
  }
  return out;
}

export function makePrimaryScale(baseHex: string) {
  return makeScaleFromBase(baseHex);
}

export function makeSecondaryScale(baseHex: string) {
  return makeScaleFromBase(baseHex);
}

/** Apply theme scales to :root as CSS variables Tailwind v4 uses */
export function applyThemeScales(theme: ThemePayload) {
  const el = document.documentElement;

  if (theme.primary) {
    Object.entries(theme.primary).forEach(([k, v]) =>
      el.style.setProperty(`--color-primary-${k}`, v)
    );
  }
  if (theme.secondary) {
    Object.entries(theme.secondary).forEach(([k, v]) =>
      el.style.setProperty(`--color-secondary-${k}`, v)
    );
  }
}

/** Build a payload from hex inputs you can persist & re-apply */
export function buildThemePayload(input: {
  primaryHex?: string;
  secondaryHex?: string;
}): ThemePayload {
  const payload: ThemePayload = {};
  if (input.primaryHex) payload.primary = makePrimaryScale(input.primaryHex);
  if (input.secondaryHex)
    payload.secondary = makeSecondaryScale(input.secondaryHex);
  return payload;
}

/** Persist/retrieve in localStorage (client) */
export function saveThemeToLocalStorage(key: string, theme: ThemePayload) {
  try {
    Cookies.set(key, JSON.stringify(theme));
  } catch {}
}

export function loadThemeFromLocalStorage(key: string): ThemePayload | null {
  try {
    const raw = Cookies.get(key);
    return raw ? (JSON.parse(raw) as ThemePayload) : null;
  } catch {
    return null;
  }
}
