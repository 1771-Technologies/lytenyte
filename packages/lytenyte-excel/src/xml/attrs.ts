import { escapeXml } from "./escape-xml.js";

/**
 * Builds an XML attribute string from a key-value object, producing output
 * like ` foo="1" bar="hello"`. Entries whose value is `undefined` are silently
 * omitted, allowing callers to pass an object with optional properties without
 * pre-filtering.
 *
 * This is the batch counterpart of `attr` and is the primary way OOXML element
 * helpers attach attributes to tags. Each value is XML-escaped to prevent
 * malformed output from user-supplied data.
 */
export function attrs(obj: Record<string, string | number | boolean | undefined>): string {
  return Object.entries(obj)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => ` ${k}="${escapeXml(String(v))}"`)
    .join("");
}
