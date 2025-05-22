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
import { isInert, matches } from "@1771technologies/lytenyte-dom-utils";
import { CANDIDATE_SELECTOR } from "../+constants.focus.js";

export const getCandidates = (
  el: Element,
  includeContainer: boolean,
  filter: (node: Element) => boolean,
): Element[] => {
  // even if `includeContainer=false`, we still have to check it for inertness because
  //  if it's inert, all its children are inert
  if (isInert(el)) {
    return [];
  }

  let candidates = Array.prototype.slice.apply(el.querySelectorAll(CANDIDATE_SELECTOR));
  /* v8 ignore next 4 */
  if (includeContainer && matches.call(el, CANDIDATE_SELECTOR)) {
    candidates.unshift(el);
  }
  candidates = candidates.filter(filter);
  return candidates;
};
