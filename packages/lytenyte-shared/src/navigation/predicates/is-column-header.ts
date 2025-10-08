import { getNearestMatching } from "../../dom-utils/index.js";

export function isColumnHeader(el: HTMLElement, gridId: string) {
  return (
    el.getAttribute("data-ln-header-cell") === "true" &&
    getNearestMatching(el, (c) => c.getAttribute("data-ln-viewport") === "true")?.getAttribute(
      "data-ln-gridid",
    ) === gridId
  );
}
