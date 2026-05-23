import { escapeXml } from "./escape-xml.js";

/**
 * Builds a single XML attribute fragment such as ` name="value"`, including
 * the leading space so it can be concatenated directly into an opening tag.
 *
 * When the value is `undefined` the function returns an empty string, which
 * makes conditional attribute inclusion trivial, callers can inline `attr()`
 * calls without branching. This pattern is used extensively in OOXML element
 * builders where many attributes are optional (e.g., a cell's `s` style index
 * is only emitted when a style is applied). The value is run through
 * `escapeXml` to ensure that attribute content like `"` or `&` does not break
 * the surrounding XML markup.
 */
export function attr(name: string, value: string | number | boolean | undefined): string {
  if (value === undefined) return "";

  return ` ${name}="${escapeXml(String(value))}"`;
}
