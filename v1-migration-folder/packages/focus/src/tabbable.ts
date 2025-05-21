import { CANDIDATE_SELECTOR } from "./+constants.focus.js";
import type { CheckOptions, TabbableOptions } from "./+types.focus.js";
import { getCandidates } from "./helpers/get-candidates.js";
import { getCandidatesIteratively } from "./helpers/get-candidates-iteratively.js";
import { isNodeMatchingSelectorTabbable } from "./helpers/is-node-matching-selector-tabbable.js";
import { isShadowRootTabbable } from "./helpers/is-shadow-root-tabbable.js";
import { sortByOrder } from "./helpers/sort-by-order.js";
import { matches } from "@1771technologies/lytenyte-dom-utils";

export const tabbable = function (container: Element, options?: TabbableOptions & CheckOptions) {
  options = options || {};

  let candidates;
  if (options.getShadowRoot) {
    candidates = getCandidatesIteratively([container], options.includeContainer ?? false, {
      filter: isNodeMatchingSelectorTabbable.bind(null, options),
      flatten: false,
      getShadowRoot: options.getShadowRoot,
      shadowRootFilter: isShadowRootTabbable as any,
    });
  } else {
    candidates = getCandidates(
      container,
      options.includeContainer ?? false,
      isNodeMatchingSelectorTabbable.bind(null, options),
    );
  }
  return sortByOrder(candidates);
};

export const isTabbable = function (node: Element, options?: CheckOptions) {
  options = options || {};
  if (matches.call(node, CANDIDATE_SELECTOR) === false) return false;

  return isNodeMatchingSelectorTabbable(options, node);
};
