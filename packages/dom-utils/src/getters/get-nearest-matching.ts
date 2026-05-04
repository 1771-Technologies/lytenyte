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

import { getDocumentElement } from "./get-document-element.js";
import { getParentNode } from "./get-parent-node.js";
import { isHTMLElement } from "../predicates/index.js";

/**
 * Returns the nearest element matching the predicate, starting at the given element and walking
 * up the DOM tree.
 */
export function getNearestMatching(
  start: HTMLElement,
  matchPredicate: (el: HTMLElement) => boolean,
): HTMLElement | null {
  if (matchPredicate(start)) return start;

  let current: Node | null = getParentNode(start);
  while (current && isHTMLElement(current) && current !== getDocumentElement(current)) {
    if (matchPredicate(current)) return current;
    current = current.parentElement;
  }

  return null;
}
