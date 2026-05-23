import { attrs } from "./attrs.js";

/**
 * Creates a self-closing XML element string (e.g., `<br/>`).
 *
 * Many OOXML elements carry all of their information in attributes and have no
 * text content or children, making a self-closing tag the correct
 * representation. Common examples include `<mergeCell ref="A1:B2"/>`,
 * `<col min="1" max="3" width="12"/>`, and `<selection activeCell="A1"/>`.
 * Attributes are formatted and filtered by `attrs`, so `undefined` values are
 * automatically excluded.
 */
export function emptyEl(
  tag: string,
  attributes: Record<string, string | number | boolean | undefined> = {},
): string {
  return `<${tag}${attrs(attributes)}/>`;
}
