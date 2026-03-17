import { isWebKit } from "../dom-utils/index.js";
import { getDocument } from "../dom-utils/get-document.js";
import { getWindow } from "../dom-utils/get-window.js";
import { frame } from "../dom-utils/frame/frame.js";

let originalHtmlStyles: Partial<CSSStyleDeclaration> = {};
let originalBodyStyles: Partial<CSSStyleDeclaration> = {};
let originalHtmlScrollBehavior = "";

export function standardPreventScroll(referenceElement: Element | null) {
  const doc = getDocument(referenceElement);
  const html = doc.documentElement;
  const body = doc.body;
  const win = getWindow(html);

  let scrollTop = 0;
  let scrollLeft = 0;

  if (isWebKit() && (win.visualViewport?.scale ?? 1) !== 1) {
    return null;
  }

  function lockScroll() {
    const htmlStyles = win.getComputedStyle(html);
    const bodyStyles = win.getComputedStyle(body);

    scrollTop = html.scrollTop;
    scrollLeft = html.scrollLeft;

    originalHtmlStyles = {
      scrollbarGutter: html.style.scrollbarGutter,
      overflowY: html.style.overflowY,
      overflowX: html.style.overflowX,
    };
    originalHtmlScrollBehavior = html.style.scrollBehavior;

    originalBodyStyles = {
      position: body.style.position,
      height: body.style.height,
      width: body.style.width,
      boxSizing: body.style.boxSizing,
      overflowY: body.style.overflowY,
      overflowX: body.style.overflowX,
      scrollBehavior: body.style.scrollBehavior,
    };

    const supportsStableScrollbarGutter =
      typeof CSS !== "undefined" && CSS.supports?.("scrollbar-gutter", "stable");

    const isScrollableY = html.scrollHeight > html.clientHeight;
    const isScrollableX = html.scrollWidth > html.clientWidth;
    const hasConstantOverflowY = htmlStyles.overflowY === "scroll" || bodyStyles.overflowY === "scroll";
    const hasConstantOverflowX = htmlStyles.overflowX === "scroll" || bodyStyles.overflowX === "scroll";

    const scrollbarWidth = Math.max(0, win.innerWidth - html.clientWidth);
    const scrollbarHeight = Math.max(0, win.innerHeight - html.clientHeight);

    const marginY = parseFloat(bodyStyles.marginTop) + parseFloat(bodyStyles.marginBottom);
    const marginX = parseFloat(bodyStyles.marginLeft) + parseFloat(bodyStyles.marginRight);

    Object.assign(html.style, {
      scrollbarGutter: "stable",
      overflowY:
        !supportsStableScrollbarGutter && (isScrollableY || hasConstantOverflowY) ? "scroll" : "hidden",
      overflowX:
        !supportsStableScrollbarGutter && (isScrollableX || hasConstantOverflowX) ? "scroll" : "hidden",
    });

    Object.assign(body.style, {
      position: "relative",
      height: marginY || scrollbarHeight ? `calc(100dvh - ${marginY + scrollbarHeight}px)` : "100dvh",
      width:
        marginX || (scrollbarWidth && !supportsStableScrollbarGutter)
          ? `calc(100vw - ${marginX + scrollbarWidth}px)`
          : "100vw",
      boxSizing: "border-box",
      overflow: "hidden",
      scrollBehavior: "unset",
    });

    body.scrollTop = scrollTop;
    body.scrollLeft = scrollLeft;
    html.setAttribute("data-ln-scroll-locked", "");
    html.style.scrollBehavior = "unset";
  }

  function cleanup() {
    Object.assign(html.style, originalHtmlStyles);
    Object.assign(body.style, originalBodyStyles);
    html.scrollTop = scrollTop;
    html.scrollLeft = scrollLeft;
    html.removeAttribute("data-ln-scroll-locked");
    html.style.scrollBehavior = originalHtmlScrollBehavior;
  }

  function handleResize() {
    cleanup();
    frame(lockScroll);
  }

  lockScroll();
  win.addEventListener("resize", handleResize);

  return () => {
    frame.cancel(lockScroll);
    cleanup();
    win.removeEventListener("resize", handleResize);
  };
}
