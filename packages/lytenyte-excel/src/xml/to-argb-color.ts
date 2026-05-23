/**
 * Converts a CSS-style hex color string to the 8-character ARGB format that
 * Excel requires in its OOXML markup.
 *
 * Excel stores all colors in AARRGGBB order (alpha, red, green, blue), so a
 * web-standard `#FF0000` (red) becomes `FFFF0000` (fully opaque red). This
 * function accepts three input formats:
 *
 * - `#RGB` -- shorthand, expanded to 6-char hex and prefixed with `FF` alpha.
 * - `#RRGGBB` -- standard CSS hex, prefixed with `FF` (fully opaque).
 * - `AARRGGBB` -- already in Excel's native format, returned as-is.
 *
 * The leading `#` is stripped if present, and the result is always uppercased
 * to match Excel's convention. An error is thrown for any other length.
 */
export function toArgbColor(color: string): string {
  let hex = color.replace(/^#/, "");

  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }

  if (hex.length === 6) {
    hex = "FF" + hex;
  } else if (hex.length !== 8) {
    throw new Error(`Invalid color format: "${color}". Expected #RGB, #RRGGBB, or AARRGGBB.`);
  }

  return hex.toUpperCase();
}
