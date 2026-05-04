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

import { isEditableElement } from "../../predicates/is-editable-element.js";
import { hasTabIndex } from "./has-tab-index.js";

/**
 * Returns the effective tab index of an element. For `audio`, `video`, `details`,
 * and editable elements that report a negative tab index but have no explicit
 * `tabindex` attribute, returns `0` to reflect their natural position in the tab
 * order. All other elements return their actual `tabIndex` value.
 */
export function getTabIndex(node: HTMLElement | SVGElement) {
  if (node.tabIndex < 0) {
    if ((/^(audio|video|details)$/.test(node.localName) || isEditableElement(node)) && !hasTabIndex(node)) {
      return 0;
    }
  }
  return node.tabIndex;
}
