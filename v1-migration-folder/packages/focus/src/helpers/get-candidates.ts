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
  if (includeContainer && matches.call(el, CANDIDATE_SELECTOR)) {
    candidates.unshift(el);
  }
  candidates = candidates.filter(filter);
  return candidates;
};
