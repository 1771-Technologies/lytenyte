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
import { CANDIDATE_SELECTORS } from "./+constants.focus.js";
import type { CheckOptions, TabbableOptions } from "./+types.focus.js";
import { getCandidates } from "./helpers/get-candidates.js";
import { getCandidatesIteratively } from "./helpers/get-candidates-iteratively.js";
import { isNodeMatchingSelectorFocusable } from "./helpers/is-node-matching-selector-focusable.js";
import { matches } from "@1771technologies/lytenyte-dom-utils";

export const focusable = function (container: Element, options?: CheckOptions & TabbableOptions) {
  options = options || {};

  let candidates;
  if (options.getShadowRoot) {
    candidates = getCandidatesIteratively([container], options.includeContainer ?? false, {
      filter: isNodeMatchingSelectorFocusable.bind(null, options),
      flatten: true,
      getShadowRoot: options.getShadowRoot,
    } as any);
  } else {
    candidates = getCandidates(
      container,
      options.includeContainer ?? false,
      isNodeMatchingSelectorFocusable.bind(null, options),
    );
  }

  return candidates;
};

const focusableCandidateSelector = CANDIDATE_SELECTORS.concat("iframe").join(",");
export const isFocusable = (node: Element, options?: CheckOptions) => {
  options = options || {};
  if (matches.call(node, focusableCandidateSelector) === false) return false;

  return isNodeMatchingSelectorFocusable(options, node);
};
