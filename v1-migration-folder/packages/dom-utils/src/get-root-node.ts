/*
Copyright 2025 1771 Technologies

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

import { NoElement } from "./+constants.dom-utils.js";

export const getRootNode =
  /* v8 ignore next 8 */
  !NoElement && (Element.prototype.getRootNode as unknown as boolean | undefined)
    ? (element: Element) => element?.getRootNode?.()
    : (element: Element) => element?.ownerDocument;
