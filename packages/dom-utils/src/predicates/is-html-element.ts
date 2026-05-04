/** Returns true if the value is an HTMLElement, identified by nodeType 1 and a nodeName string. */
export function isHTMLElement(el: any): el is HTMLElement {
  return typeof el === "object" && el != null && el.nodeType === 1 && typeof el.nodeName === "string";
}
