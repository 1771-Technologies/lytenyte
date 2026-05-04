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

import { isFrame } from "../../predicates/is-frame.js";
import { isHTMLElement } from "../../predicates/is-html-element.js";
import { focusableSelector } from "../constants.js";
import type { IncludeContainerType } from "../types.js";
import { isFocusable } from "./is-focusable.js";

/**
 * Returns all focusable elements within a container. Optionally includes the container
 * itself based on the `includeContainer` option. Elements within nested iframes are
 * also traversed and included.
 */
export const getFocusables = (
  container: Pick<HTMLElement, "querySelectorAll"> | null,
  includeContainer: IncludeContainerType = false,
) => {
  if (!container) return [];
  const elements = Array.from(container.querySelectorAll<HTMLElement>(focusableSelector));

  const include = includeContainer == true || (includeContainer == "if-empty" && elements.length === 0);
  if (include && isHTMLElement(container) && isFocusable(container)) {
    elements.unshift(container);
  }

  const result: HTMLElement[] = [];
  for (const element of elements.filter(isFocusable)) {
    if (isFrame(element) && element.contentDocument) {
      result.push(...getFocusables(element.contentDocument.body));
    } else {
      result.push(element);
    }
  }

  return result;
};
