/**
 * Reverses XML entity escaping, converting the five standard XML entity
 * references (`&lt;`, `&gt;`, `&quot;`, `&apos;`, `&amp;`) back to their
 * literal characters.
 *
 * Used when reading cell values and attributes from OOXML part files. For
 * instance, a shared-string entry stored as `A &amp; B` in the XML needs to
 * be decoded back to the original `A & B` for display.
 *
 * The replacement order matters: `&amp;` must be unescaped last. If it were
 * handled first, an original literal like `&amp;lt;` would be incorrectly
 * decoded in two passes -- first to `&lt;`, then to `<` -- producing a value
 * that was never in the source document.
 */
export function unescapeXml(str: string): string {
  return str
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&");
}
