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
import { getNodeName } from "./get-node-name.js";
import { isShadowRoot } from "../predicates/index.js";

/**
 * Returns the logical parent node of the given node, accounting for shadow roots, slots, and
 * assigned slots.
 */
export function getParentNode(node: Node): Node {
  if (getNodeName(node) === "html") return node;
  const result =
    (node as any).assignedSlot ||
    node.parentNode ||
    (isShadowRoot(node) && node.host) ||
    getDocumentElement(node);

  return isShadowRoot(result) ? result.host : result;
}
