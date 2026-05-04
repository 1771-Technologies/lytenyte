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
