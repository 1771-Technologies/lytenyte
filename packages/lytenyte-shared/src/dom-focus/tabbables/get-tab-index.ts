import { hasTabIndex } from "../../dom-utils/has-tab-index.js";
import { isEditableElement } from "../../dom-utils/is-editable-element.js";

/**
 * Returns the effective tab index of an element. For `audio`, `video`, `details`,
 * and editable elements that report a negative tab index but have no explicit
 * `tabindex` attribute, returns `0` to reflect their natural position in the tab
 * order. All other elements return their actual `tabIndex` value.
 */
export function getTabIndex(node: HTMLElement | SVGElement) {
  if (node.tabIndex < 0) {
    if ((/^(audio|video|details)$/.test(node.localName) || isEditableElement(node)) && !hasTabIndex(node)) {
      return 0;
    }
  }
  return node.tabIndex;
}
