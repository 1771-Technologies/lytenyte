import { hasTabIndex } from "../../dom-utils/has-tab-index.js";
import { isEditableElement } from "../../dom-utils/is-editable-element.js";

export function getTabIndex(node: HTMLElement | SVGElement) {
  if (node.tabIndex < 0) {
    if ((/^(audio|video|details)$/.test(node.localName) || isEditableElement(node)) && !hasTabIndex(node)) {
      return 0;
    }
  }
  return node.tabIndex;
}
