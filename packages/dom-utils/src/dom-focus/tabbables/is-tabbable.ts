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

import { hasNegativeTabIndex } from "./has-negative-tab-index.js";
import { isFocusable } from "../focusables/is-focusable.js";

/**
 * Determines whether an element participates in the sequential keyboard tab order.
 * An element is tabbable if it is not inside an inert subtree, has a positive tab
 * index, or is focusable and does not have a negative tab index.
 */
export function isTabbable(el: HTMLElement | null): el is HTMLElement {
  if (!el || el.closest("[inert]")) return false;
  if (el.tabIndex > 0) return true;
  return isFocusable(el) && !hasNegativeTabIndex(el);
}
