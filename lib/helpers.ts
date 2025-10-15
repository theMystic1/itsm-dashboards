export function humanSize(bytes: number) {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let i = 0,
    n = bytes;
  while (n >= 1000 && i < units.length - 1) {
    n /= 1000;
    i++;
  }
  return `${n.toFixed(n < 10 ? 2 : 1)} ${units[i]}`;
}

export function formatDateProper(date: Date, locale?: string): string {
  // On the server, fall back to a safe default
  const userLocale =
    typeof navigator !== "undefined" && navigator.language
      ? navigator.language
      : locale || "en-CA";

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  return new Intl.DateTimeFormat(userLocale, options).format(date);
}

export const getTimeAgo = (
  dateString: string,
  locale: string = "en-CA"
): string => {
  const actionDate = new Date(dateString);
  const now = new Date();

  const diffInSeconds = Math.floor(
    (now.getTime() - actionDate.getTime()) / 1000
  );
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} sec${diffInSeconds === 1 ? "" : "s"} ago`;
  }

  if (diffInMinutes < 60) {
    return `${diffInMinutes} min${diffInMinutes === 1 ? "" : "s"} ago`;
  }

  if (diffInHours < 24) {
    return `${diffInHours} hr${diffInHours === 1 ? "" : "s"} ago`;
  }

  if (diffInDays === 1) {
    return "Yesterday";
  }

  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "2-digit",
  };

  // Use provided locale or fallback
  return actionDate.toLocaleDateString(
    typeof navigator !== "undefined" && navigator.language
      ? navigator.language
      : locale,
    options
  );
};
export function formatTo12Hour(date: Date) {
  if (!(date instanceof Date)) {
    date = new Date(date); // allow string or timestamp too
  }

  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'

  const minutesStr = minutes < 10 ? "0" + minutes : minutes;

  return `${hours}:${minutesStr} ${ampm}`;
}

// MentionText.tsx

type Token =
  | { type: "text"; value: string }
  | { type: "mention"; value: string; raw: string };

const mentionRegex = /@([\p{L}\p{N}_.-]+)/gu;
// matches @name with letters/numbers/underscore/dot/dash (Unicode-safe)

export function tokenizeMentions(input: string): Token[] {
  const tokens: Token[] = [];
  let last = 0;
  for (const m of input.matchAll(mentionRegex)) {
    const start = m.index ?? 0;
    if (start > last)
      tokens.push({ type: "text", value: input.slice(last, start) });
    tokens.push({ type: "mention", value: m[1], raw: m[0] });
    last = start + m[0].length;
  }
  if (last < input.length)
    tokens.push({ type: "text", value: input.slice(last) });
  return tokens;
}

// --- OKLCH ➜ OKLab ➜ linear sRGB ➜ sRGB ➜ HEX -----------------------------

type Oklch = { L: number; C: number; h: number; a?: number };

/** Parse CSS oklch() like: 'oklch(62.5% 0.25 264 / 0.8)' */
export function parseOklch(input: string): Oklch {
  const m = input
    .trim()
    .match(
      /^oklch\(\s*([0-9.]+%?|[0-9.]+)\s+([0-9.]+)\s+([\-0-9.]+(?:deg)?)\s*(?:\/\s*([0-9.]+))?\s*\)$/i
    );
  if (!m) throw new Error("Invalid oklch() syntax");
  let [, Ls, Cs, hs, As] = m;

  // Lightness: allow % (CSS) or 0..1
  let L = Ls.endsWith("%") ? parseFloat(Ls) / 100 : parseFloat(Ls);
  // Chroma: unitless
  const C = parseFloat(Cs);
  // Hue: allow degrees with or without 'deg'
  let h = parseFloat(hs.replace("deg", ""));
  // Normalize hue to [0, 360)
  h = ((h % 360) + 360) % 360;

  const a = As !== undefined ? Math.max(0, Math.min(1, parseFloat(As))) : 1;

  return { L, C, h, a };
}

/** Core conversion: OKLCH (L 0..1, C 0..?, h deg) -> sRGB [0..1], no gamma issues */
export function oklchToSRGB({ L, C, h }: Oklch): [number, number, number] {
  const rad = (h * Math.PI) / 180;
  const a = C * Math.cos(rad);
  const b = C * Math.sin(rad);

  // OKLab -> LMS (non-linear)
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;

  // Cube to linear LMS
  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  // LMS -> linear sRGB
  const r_lin = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const g_lin = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const b_lin = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;

  return [r_lin, g_lin, b_lin];
}

/** sRGB gamma encode (linear -> display) */
function encodeSRGB(u: number): number {
  if (u <= 0.0031308) return 12.92 * u;
  return 1.055 * Math.pow(u, 1 / 2.4) - 0.055;
}

/** Clamp to [0,1] */
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

/** Convert to #RRGGBB or #RRGGBBAA (if alpha !== 1) */
export function srgbToHex(r: number, g: number, b: number, a = 1): string {
  const R = Math.round(clamp01(encodeSRGB(r)) * 255);
  const G = Math.round(clamp01(encodeSRGB(g)) * 255);
  const B = Math.round(clamp01(encodeSRGB(b)) * 255);
  const A = Math.round(clamp01(a) * 255);

  const to2 = (n: number) => n.toString(16).padStart(2, "0").toUpperCase();
  return a < 1
    ? `#${to2(R)}${to2(G)}${to2(B)}${to2(A)}`
    : `#${to2(R)}${to2(G)}${to2(B)}`;
}

/** Direct: OKLCH components -> hex (may clip out-of-gamut) */
export function oklchToHex(L: number, C: number, h: number, a = 1): string {
  const [r, g, b] = oklchToSRGB({ L, C, h, a });
  return srgbToHex(r, g, b, a);
}

/** From CSS string: 'oklch(62% 0.25 264 / 0.8)' -> hex (may clip) */
export function oklchCssToHex(css: string): string {
  const { L, C, h, a = 1 } = parseOklch(css);
  return oklchToHex(L, C, h, a);
}

/** Optional: reduce chroma until inside sRGB gamut (binary search) */
export function oklchToHexGamutMapped(
  L: number,
  C: number,
  h: number,
  a = 1
): string {
  let lo = 0,
    hi = C;
  // If already in gamut, return early
  const inGamut = (r: number, g: number, b: number) =>
    r >= 0 && r <= 1 && g >= 0 && g <= 1 && b >= 0 && b <= 1;

  for (let i = 0; i < 18; i++) {
    const mid = (lo + hi) / 2;
    const [r, g, b] = oklchToSRGB({ L, C: mid, h });
    if (inGamut(r, g, b)) lo = mid;
    else hi = mid;
  }
  const [r, g, b] = oklchToSRGB({ L, C: lo, h });
  return srgbToHex(r, g, b, a);
}

/** Convenience for CSS string with gamut mapping */
export function oklchCssToHexGamutMapped(css: string): string {
  const { L, C, h, a = 1 } = parseOklch(css);
  return oklchToHexGamutMapped(L, C, h, a);
}
