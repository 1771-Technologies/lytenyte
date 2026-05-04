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

import { getDocument } from "../getters/get-document.js";
import { getWindow } from "../getters/get-window.js";

/**
 * Returns true if the document has inset (overlay) scrollbars, detected by
 * comparing the window's inner width against the document's client width.
 * Inset scrollbars sit on top of content and do not consume layout space.
 */
export function hasInsetScrollbars(referenceElement: Element | null) {
  const doc = getDocument(referenceElement);
  const win = getWindow(doc);

  return win.innerWidth - doc.documentElement.clientWidth > 0;
}
