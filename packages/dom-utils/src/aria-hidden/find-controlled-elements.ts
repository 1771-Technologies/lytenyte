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

import { getAriaControls, getRootNode } from "../getters/index.js";

const INTERACTIVE_CONTAINER_ROLE = new Set([
  "menu",
  "listbox",
  "dialog",
  "grid",
  "tree",
  "region",
  "application",
]);

/**
 * Finds controlled elements recursively starting from a search root.
 * Calls the provided callback for each valid controlled element found.
 */
export function findControlledElements(
  searchRoot: HTMLElement,
  callback: (controlledElement: HTMLElement) => void,
): void {
  const rootNode = getRootNode(searchRoot);
  const visitedIds = new Set<string>();

  const findRecursive = (root: HTMLElement) => {
    const controllingElements = root.querySelectorAll<HTMLElement>(
      "[aria-controls]",
    ) as unknown as HTMLElement[];

    for (const controller of controllingElements) {
      // Only follow aria-controls if the controller is expanded
      if (controller.getAttribute("aria-expanded") !== "true") continue;

      const controlledIds = getAriaControls(controller);

      for (const id of controlledIds) {
        if (!id || visitedIds.has(id)) continue;
        visitedIds.add(id);

        const controlledElement = rootNode.getElementById(id);
        if (controlledElement) {
          // Only include if the controlled element has an interactive container role
          // and is not a modal (which manages its own interactions/focus)
          const role = controlledElement.getAttribute("role");
          const modal = controlledElement.getAttribute("aria-modal") === "true";

          if (role && INTERACTIVE_CONTAINER_ROLE.has(role) && !modal) {
            callback(controlledElement);

            // Recursively search within the controlled element for more aria-controls
            findRecursive(controlledElement);
          }
        }
      }
    }
  };

  findRecursive(searchRoot);
}
