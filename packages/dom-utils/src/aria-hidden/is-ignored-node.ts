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

const ignoreableNodes = new Set<string>(["script", "output", "status", "next-route-announcer"]);

/**
 * Returns true when an element should be excluded from `aria-hidden` management.
 *
 * Ignored when any of the following is true:
 * - The element's `localName` is one of the built-in ignoreable tags (`script`,
 *   `output`, `status`, `next-route-announcer`)
 * - The element has an explicit `role="status"`
 * - The element carries an `aria-live` attribute
 * - The element matches `[data-live-announcer]`
 *
 * These elements are live regions or announcer nodes that must remain visible
 * to assistive technology even when surrounding content is hidden.
 */
export const isIgnoredNode = (node: Element) => {
  if (ignoreableNodes.has(node.localName)) return true;
  if (node.role === "status") return true;
  if (node.hasAttribute("aria-live")) return true;
  return node.matches("[data-live-announcer]");
};
