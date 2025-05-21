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
