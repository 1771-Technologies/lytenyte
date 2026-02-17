export function isSelectableOption(el: Element) {
  return el.getAttribute("data-ln-smart-option") && el.getAttribute("data-ln-selectable") !== "false";
}
