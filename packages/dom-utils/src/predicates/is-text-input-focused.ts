/*
Copyright 2026 1771 Technologies

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

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
