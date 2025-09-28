import { isHTMLElement } from "./is-html-element.js";
import { isInputElement } from "./is-input-element.js";

const TEXTAREA_SELECT_REGEX = /(textarea|select)/;
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
