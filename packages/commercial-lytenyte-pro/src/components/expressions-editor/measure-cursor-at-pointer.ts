import type { CursorCoordinates } from "./types.js";

export function measureCursorPosition(textarea: HTMLTextAreaElement, cursorIndex: number): CursorCoordinates {
  const mirror = document.createElement("div");
  const computed = window.getComputedStyle(textarea);

  const propertiesToCopy = [
    "fontFamily",
    "fontSize",
    "fontWeight",
    "fontStyle",
    "letterSpacing",
    "lineHeight",
    "textTransform",
    "wordSpacing",
    "textIndent",
    "paddingTop",
    "paddingRight",
    "paddingBottom",
    "paddingLeft",
    "borderTopWidth",
    "borderRightWidth",
    "borderBottomWidth",
    "borderLeftWidth",
    "boxSizing",
    "whiteSpace",
    "wordBreak",
    "overflowWrap",
    "tabSize",
  ] as const;

  mirror.style.position = "absolute";
  mirror.style.top = "-9999px";
  mirror.style.left = "-9999px";
  mirror.style.visibility = "hidden";
  mirror.style.overflow = "hidden";
  mirror.style.width = computed.width;

  for (const prop of propertiesToCopy) {
    mirror.style[prop] = computed[prop];
  }

  const textBeforeCursor = textarea.value.substring(0, cursorIndex);
  const textNode = document.createTextNode(textBeforeCursor);
  const marker = document.createElement("span");
  marker.textContent = "\u200b";

  mirror.appendChild(textNode);
  mirror.appendChild(marker);

  document.body.appendChild(mirror);

  try {
    const textareaRect = textarea.getBoundingClientRect();
    const markerRect = marker.getBoundingClientRect();
    const mirrorRect = mirror.getBoundingClientRect();

    const top = textareaRect.top + (markerRect.top - mirrorRect.top) - textarea.scrollTop;
    const left = textareaRect.left + (markerRect.left - mirrorRect.left) - textarea.scrollLeft;
    const lineHeight = parseFloat(computed.lineHeight) || markerRect.height;

    return { top, left, lineHeight };
  } finally {
    document.body.removeChild(mirror);
  }
}
