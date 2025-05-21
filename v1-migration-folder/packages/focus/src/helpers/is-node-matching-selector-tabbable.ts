import { getTabIndex, isNonTabbableRadio } from "@1771technologies/lytenyte-dom-utils";
import type { CheckOptions } from "../+types.focus.js";
import { isNodeMatchingSelectorFocusable } from "./is-node-matching-selector-focusable.js";

export const isNodeMatchingSelectorTabbable = function (options: CheckOptions, node: Element) {
  if (
    isNonTabbableRadio(node) ||
    getTabIndex(node as HTMLElement) < 0 ||
    !isNodeMatchingSelectorFocusable(options, node)
  ) {
    return false;
  }
  return true;
};
