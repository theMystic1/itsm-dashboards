declare module "culori" {
  export type AnyColor = unknown;

  export function oklch(
    input: string | AnyColor
  ): { l: number; c: number; h: number } | null;

  export function hsl(
    input: string | AnyColor
  ): { h?: number; s?: number; l?: number } | null;

  export function rgb(input: string | AnyColor): AnyColor;

  export function mix(
    a: AnyColor,
    b: AnyColor,
    t?: number,
    mode?: string
  ): AnyColor;

  export function formatHex(color: AnyColor): string;
  export function formatCss(color: AnyColor): string;
}
