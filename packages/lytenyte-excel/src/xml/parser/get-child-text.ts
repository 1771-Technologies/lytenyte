import type { XmlElement } from "./types.js";
import { findChildElement } from "./find-child-element.js";

/**
 * Returns the text content of the first direct child element matching the
 * given tag name, or `undefined` if no such child exists or the child has
 * no text.
 *
 * This is a convenience shortcut for the very common OOXML pattern where a
 * value is stored as the text node of a named child element. For instance,
 * a cell's numeric value lives inside `<v>42</v>`, a formula in
 * `<f>SUM(A1:A10)</f>`, and a shared-string segment in `<t>hello</t>`.
 * Rather than chaining `findChildElement` + accessing `.text`, callers can
 * use this single function.
 */
export function getChildText(parent: XmlElement, tag: string): string | undefined {
  const child = findChildElement(parent, tag);

  return child?.text;
}
