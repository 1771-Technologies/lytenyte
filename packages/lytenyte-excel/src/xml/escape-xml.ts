/**
 * Standard XML declaration prepended to every part file inside an OOXML (.xlsx)
 * package. The OOXML specification requires each XML part (e.g., worksheets,
 * shared strings, styles) to begin with this declaration. It specifies UTF-8
 * encoding and `standalone="yes"` because OOXML parts do not reference an
 * external DTD.
 */
export const XML_DECLARATION = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n';

/**
 * Escapes the five characters that are special in XML (`&`, `<`, `>`, `"`, `'`)
 * by replacing them with their corresponding XML entity references.
 *
 * This is critical for XLSX generation because cell values, sheet names, and
 * other user-supplied strings are interpolated directly into XML markup.
 * Without escaping, a cell containing `<script>` or `A&B` would produce
 * malformed XML that Excel cannot open. The ampersand (`&`) is replaced first
 * to avoid double-escaping the ampersands introduced by subsequent replacements.
 */
export function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
