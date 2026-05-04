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

import { focusableSelector } from "../constants.js";

/**
 * Determines whether an element is focusable. An element is considered focusable if it
 * matches the focusable selector, is not inside an inert subtree, and has a non-zero
 * rendered size or at least one client rect.
 */
export function isFocusable(el: HTMLElement | null): el is HTMLElement {
  if (!el || el.closest("[inert]")) return false;
  return (
    el.matches(focusableSelector) &&
    (el.offsetWidth > 0 || el.offsetHeight > 0 || el.getClientRects().length > 0)
  );
}
