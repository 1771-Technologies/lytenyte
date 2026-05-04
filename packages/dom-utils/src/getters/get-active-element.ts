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

/**
 * Returns the deepest active element within the given document or shadow root, walking down
 * through nested open shadow roots.
 */
export function getActiveElement(rootNode: Document | ShadowRoot): HTMLElement | null {
  let active = rootNode.activeElement as HTMLElement | null;

  // Walk down through open shadow roots to the deepest focused element
  while (active && active.shadowRoot) {
    const inner = active.shadowRoot.activeElement as HTMLElement | null;

    active = inner;
  }

  return active;
}
