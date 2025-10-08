import { getNearestMatching } from "../../dom-utils/index.js";

export function isDetailCell(el: HTMLElement, gridId: string) {
  return (
    el.getAttribute("data-ln-row-detail") === "true" &&
    getNearestMatching(el, (c) => c.getAttribute("data-ln-viewport") === "true")?.getAttribute(
      "data-ln-gridid",
    ) === gridId
  );
}
