import { emptyEl } from "./empty-el.js";
import { el } from "./el.js";

/**
 * Creates an XML element that adapts its form based on whether content is
 * provided: self-closing (`<tag/>`) when content is `undefined` or empty,
 * and content-wrapping (`<tag>...</tag>`) otherwise.
 *
 * This is useful for OOXML elements whose content is conditionally present.
 * For instance, a cell `<c>` element may or may not contain a `<v>` value
 * child depending on whether the cell is blank. Using `optEl` avoids the
 * need for an explicit branch at every call site.
 */
export function optEl(
  tag: string,
  attributes: Record<string, string | number | boolean | undefined> = {},
  content?: string,
): string {
  if (content === undefined || content === "") {
    return emptyEl(tag, attributes);
  }

  return el(tag, attributes, content);
}
