import { isHTMLElement } from "./is-html-element";
import { isInput } from "./is-input";

const TEXTAREA_SELECT_REGEX = /(textarea|select)/;

export function isEditableElement(el: HTMLElement | EventTarget | null) {
  if (el == null || !isHTMLElement(el)) return false;
  try {
    return (
      (isInput(el) && el.selectionStart != null) ||
      TEXTAREA_SELECT_REGEX.test(el.localName) ||
      el.isContentEditable ||
      el.getAttribute("contenteditable") === "true" ||
      el.getAttribute("contenteditable") === ""
    );
  } catch {
    return false;
  }
}
