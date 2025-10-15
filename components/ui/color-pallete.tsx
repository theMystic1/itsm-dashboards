"use client";

import { useMemo, useRef, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { oklch as toOKLCH, hsl as toHSL, formatHex } from "culori";
import {
  buildThemePayload,
  applyThemeScales,
  saveThemeToLocalStorage,
} from "@/lib/theme-utils";
import { useRouter } from "next/navigation";

import Cookies from "js-cookie";

type SavedColor = { id: string; hex: string };

// Helpers: try CSS var → localStorage → fallback
function readCurrentPrimary500(): string | null {
  try {
    // 1) From CSS var set on :root (oklch(...))
    const cssVal = getComputedStyle(document.documentElement)
      .getPropertyValue("--color-primary-500")
      .trim();
    if (cssVal) {
      const ok = toOKLCH(cssVal);
      if (ok) return formatHex(ok as any);
    }

    // 2) From saved theme payload in localStorage (we stored "oklch(...)" strings)
    const raw = Cookies.get("app-theme");
    if (raw) {
      const t = JSON.parse(raw);
      const v: string | undefined = t?.primary?.["500"];
      if (v) {
        const ok = toOKLCH(v);
        if (ok) return formatHex(ok as any);
      }
    }
  } catch {}
  return null;
}

export default function ColorPaletteDialog({
  initial = "#9966cc",
  savedKey = "saved-colors",
  onCancel,
  onSave,
  title = "Choose a color",
}: {
  initial?: string;
  savedKey?: string;
  onCancel?: () => void;
  onSave?: (hex: string) => void;
  title?: string;
}) {
  const [hex, setHex] = useState<string>(() => {
    const current = readCurrentPrimary500();
    return current ?? normalizeHex(initial); // "current color or this color if none"
  });
  const [saved, setSaved] = useState<SavedColor[]>(
    () => savedKey && JSON.parse(Cookies.get(savedKey) || "[]")
  );
  const inputRef = useRef<HTMLInputElement>(null);

  // ✅ derive HSL from hex (no extra state, no effects)
  const { h, s, l } = useMemo(() => hsl(hex), [hex]);
  const router = useRouter();
  // Preview & button colors (memoized)
  const previewShade = useMemo(() => mixOklchHex(hex, "#000000", 0.18), [hex]);
  const hoverHex = useMemo(() => mixOklchHex(hex, "#000000", 0.14), [hex]);
  const btnText = useMemo(() => textOn(hex), [hex]);

  const canSave = /^#[0-9A-Fa-f]{6}$/.test(hex);

  function handleAddSaved() {
    if (!canSave) return;
    const updated = [
      { id: crypto.randomUUID(), hex: hex.toUpperCase() },
      ...saved,
    ].slice(0, 18);
    setSaved(updated);
    Cookies.set(savedKey, JSON.stringify(updated));
  }

  function handleClickSaved(c: SavedColor) {
    setHex(c.hex);
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="color-card w-[360px] rounded-2xl bg-white p-4 shadow-[--shadow-card] border border-black/5"
    >
      {/* Preview */}
      <div
        className="h-32 rounded-xl mb-3"
        style={{
          background: `linear-gradient(180deg, ${hex} 0%, ${previewShade} 100%)`,
        }}
      />

      {/* Picker */}
      <div className="rounded-xl border border-black/5 p-3 bg-neutral-50">
        <HexColorPicker
          color={hex}
          onChange={setHex}
          style={{ width: "100%" }}
        />

        {/* Hue slider (writes hex directly) */}
        <label className="mt-3 block text-xs font-medium text-neutral-600">
          Hue
          <input
            aria-label="Hue"
            type="range"
            min={0}
            max={360}
            value={h}
            onChange={(e) => setHex(hslToHex(Number(e.target.value), s, l))}
            className="mt-1 w-full accent-current"
            style={{
              background:
                "linear-gradient(90deg, red, #ff0, #0f0, #0ff, #00f, #f0f, red)",
              height: 6,
              borderRadius: 9999,
            }}
          />
        </label>

        {/* Brightness slider (writes hex directly) */}
        <label className="mt-3 block text-xs font-medium text-neutral-600">
          Brightness
          <input
            aria-label="Brightness"
            type="range"
            min={0}
            max={100}
            value={l}
            onChange={(e) => setHex(hslToHex(h, s, Number(e.target.value)))}
            className="mt-1 w-full accent-current"
            style={{
              background: `linear-gradient(90deg, #000, ${hex}, #fff)`,
              height: 6,
              borderRadius: 9999,
            }}
          />
        </label>

        {/* Hex input */}
        <div className="mt-3 flex items-center gap-2">
          <span className="text-xs text-neutral-500 w-[72px]">Hex value</span>
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              aria-label="Hex value"
              value={hex}
              onChange={(e) => setHex(normalizeHex(e.target.value))}
              spellCheck={false}
              className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm font-mono outline-none focus:ring-2 focus:ring-primary-500"
              placeholder={"#9966CC"}
            />
            <div
              className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 rounded-full ring-1 ring-black/10"
              style={{ backgroundColor: hex }}
              aria-hidden
            />
          </div>
        </div>
      </div>

      {/* Saved colors */}
      <div className="mt-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-neutral-700">Saved colors:</p>
          <button
            onClick={handleAddSaved}
            className="text-xs font-medium text-primary-600 hover:text-primary-700"
          >
            + Add
          </button>
        </div>
        <div className="mt-2 grid grid-cols-9 gap-2">
          {saved.map((c) => (
            <button
              key={c.id}
              onClick={() => handleClickSaved(c)}
              className="h-7 w-7 rounded-full ring-1 ring-black/10 hover:ring-black/20"
              style={{ backgroundColor: c.hex }}
              aria-label={`Saved color ${c.hex}`}
              title={c.hex}
            />
          ))}
          <div
            className="h-7 w-7 rounded-full ring-2 ring-primary-500"
            style={{ backgroundColor: hex }}
            aria-hidden
          />
        </div>
      </div>

      {/* Actions */}
      <div className="mt-5 flex gap-2">
        <button
          onClick={onCancel}
          className="flex-1 rounded-xl border border-black/10 bg-white px-4 py-2 text-sm font-medium hover:bg-neutral-50"
        >
          Cancel
        </button>

        {/* Confirm button uses selected color */}
        <button
          // disabled={!canSave}
          onClick={() => {
            // 4) your existing callback (if you need it)
            onSave?.(hex);
          }}
          style={{
            ["--btn" as any]: hex,
            ["--btn-hover" as any]: hoverHex,
            ["--btn-text" as any]: btnText,
          }}
          className="
  flex-1 rounded-xl 
  bg-[var(--btn)] hover:bg-[var(--btn-hover)]
  text-[var(--btn-text)]
  px-4 py-2 text-sm font-semibold shadow-sm disabled:opacity-50
"
        >
          Save Color
        </button>
      </div>
    </div>
  );
}

/* ------------------------------ utils ------------------------------ */
function normalizeHex(v: string) {
  const x = v.trim().replace(/^#?/, "").slice(0, 6);
  return "#" + x.padEnd(6, "0").toUpperCase();
}
function hsl(hex: string) {
  const hslObj = toHSL(hex) || {};
  const h = Math.round(hslObj.h ?? 0);
  const s = Math.max(0, Math.min(1, hslObj.s ?? 0)) * 100;
  const l = Math.round(Math.max(0, Math.min(1, hslObj.l ?? 0)) * 100);
  return { h, s, l };
}
function hslToHex(h: number, sPct: number, lPct: number) {
  return formatHex({ mode: "hsl", h, s: sPct / 100, l: lPct / 100 } as any);
}
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerpHue = (a: number, b: number, t: number) => {
  const d = ((b - a + 540) % 360) - 180;
  return (a + d * t + 360) % 360;
};
function mixOklchHex(aHex: string, bHex: string, t = 0.5): string {
  const a = toOKLCH(aHex);
  const b = toOKLCH(bHex);
  if (!a || !b) return aHex;
  const l = lerp(a.l, b.l, t);
  const c = lerp(a.c, b.c, t);
  const h = lerpHue(a.h ?? 0, b.h ?? 0, t);
  return formatHex({ mode: "oklch", l, c, h } as any);
}
function textOn(hex: string) {
  const c = toOKLCH(hex);
  return (c?.l ?? 0.72) > 0.75 ? "#111111" : "#ffffff";
}
