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
import { isShadowRoot } from "./is-shadow-root.js";

type ElementTarget = HTMLElement | EventTarget | null | undefined;

/**
 * Returns true if parent contains child, handling standard DOM containment as well as shadow DOM
 * and nested shadow roots.
 */
export function contains(parent: ElementTarget, child: ElementTarget) {
  if (!isHTMLElement(parent) || !isHTMLElement(child)) return false;

  if (parent === child) return true;
  if (parent.contains(child)) return true;

  const rootNode = child.getRootNode();
  if (rootNode && isShadowRoot(rootNode)) {
    let next = child;
    while (next) {
      if (parent === next) return true;
      // @ts-expect-error this is fine, but TypeScript will complain. Not worth it to type it properly
      next = next.parentNode || next.host;
    }
  }
  return false;
}
