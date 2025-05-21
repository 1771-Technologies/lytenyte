import { isHidden } from "./is-hidden.js";
import type { CheckOptions } from "../+types.focus.js";
import {
  isDetailsWithSummary,
  isDisabledFromFieldset,
  isHiddenInput,
  isInert,
} from "@1771technologies/lytenyte-dom-utils";

export const isNodeMatchingSelectorFocusable = (options: CheckOptions, node: Element) => {
  if (
    (node as { disabled?: boolean }).disabled ||
    // we must do an inert look up to filter out any elements inside an inert ancestor
    //  because we're limited in the type of selectors we can use in JSDom (see related
    //  note related to `candidateSelectors`)
    isInert(node) ||
    isHiddenInput(node) ||
    isHidden(node, options) ||
    // For a details element with a summary, the summary element gets the focus
    isDetailsWithSummary(node) ||
    isDisabledFromFieldset(node)
  ) {
    return false;
  }
  return true;
};
