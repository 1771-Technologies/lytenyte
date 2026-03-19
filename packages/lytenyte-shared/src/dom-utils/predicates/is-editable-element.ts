import { isHTMLElement } from "./is-html-element.js";
import { isInputElement } from "./is-input-element.js";

const TEXTAREA_SELECT_REGEX = /(textarea|select)/;
/**
 * Returns true if the element is an editable field: an input with selectionStart, a textarea or
 * select, or a contenteditable element.
 */
export function isEditableElement(el: HTMLElement | EventTarget | null) {
  if (el == null || !isHTMLElement(el)) return false;

  return (
    (isInputElement(el) && el.selectionStart != null) ||
    TEXTAREA_SELECT_REGEX.test(el.localName) ||
    el.isContentEditable ||
    el.getAttribute("contenteditable") === "true" ||
    el.getAttribute("contenteditable") === ""
  );
}
