const TEXT_INPUT_TYPES = new Set(["text", "search", "email", "url", "tel", "password", "number", "date"]);

/**
 * Returns true if the currently focused element is an editable text input, textarea, or
 * contenteditable element.
 */
export function isTextInputFocused() {
  const el = document.activeElement as HTMLInputElement;
  if (!el) return false;

  if (el.tagName === "TEXTAREA") return true;

  if (el.tagName === "INPUT") {
    return TEXT_INPUT_TYPES.has(el.type) && !el.readOnly && !el.disabled;
  }

  return el.isContentEditable === true;
}
