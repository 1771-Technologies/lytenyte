import { attrs } from "./attrs.js";

/**
 * Creates an XML element string with an opening tag, attributes, inner content,
 * and a closing tag (e.g., `<row r="1"><c>...</c></row>`).
 *
 * This is the fundamental building block for generating OOXML markup. The
 * `content` parameter is expected to be pre-escaped or to consist of nested
 * element strings. Attributes are formatted and filtered by `attrs`, so
 * `undefined` values are automatically excluded.
 */
export function el(
  tag: string,
  attributes: Record<string, string | number | boolean | undefined>,
  content: string,
): string {
  return `<${tag}${attrs(attributes)}>${content}</${tag}>`;
}
