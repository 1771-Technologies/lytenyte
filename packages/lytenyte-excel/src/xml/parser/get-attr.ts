import type { XmlElement } from "./types.js";

/**
 * Reads a named attribute value from an XML element, returning `undefined`
 * if the attribute is not present.
 *
 * Attribute values returned by this function have already been unescaped
 * during parsing, so they contain literal characters rather than XML entity
 * references. This helper provides a clean abstraction over the element's
 * raw `attrs` record and is used throughout the OOXML readers to extract
 * values like cell references (`r`), style indices (`s`), types (`t`), and
 * relationship IDs (`r:id`).
 */
export function getAttr(el: XmlElement, name: string): string | undefined {
  return el.attrs[name];
}
