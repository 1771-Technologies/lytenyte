import { escapeXml } from "./escape-xml.js";

/**
 * Strips characters that are illegal in XML 1.0 and then escapes special XML
 * characters, producing a string that is safe to embed in any XML content or
 * attribute value.
 *
 * XML 1.0 forbids most ASCII control characters (U+0000--U+0008, U+000B,
 * U+000C, U+000E--U+001F, and U+007F). Spreadsheet data frequently contains
 * these invisible characters as artifacts of copy-paste from terminals,
 * databases, or legacy systems. If they are left in place, the resulting XLSX
 * file will be rejected by XML parsers and Excel will report the file as
 * corrupt. This function silently removes them before applying standard XML
 * escaping via `escapeXml`.
 */
export function sanitizeXmlString(str: string): string {
  // eslint-disable-next-line no-control-regex
  const sanitized = str.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");

  return escapeXml(sanitized);
}
