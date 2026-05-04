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

/**
 * Prevents scrolling on the document by setting `overflow: hidden` on the
 * root element. Returns a cleanup function that restores the original overflow
 * value. Intended for iOS and environments without inset scrollbars where a
 * simpler lock strategy is sufficient.
 */
export function basicPreventScroll(referenceElement: Element | null) {
  const doc = getDocument(referenceElement);
  const html = doc.documentElement;
  const originalOverflow = html.style.overflow;
  html.style.overflow = "hidden";
  return () => {
    html.style.overflow = originalOverflow;
  };
}
