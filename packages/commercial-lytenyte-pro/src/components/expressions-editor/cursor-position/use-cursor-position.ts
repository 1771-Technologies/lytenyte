import { useRef, useCallback } from "react";
import type { VirtualElement } from "../../external/floating-ui.js";
import { measureCursorPosition } from "./measure-cursor-at-pointer.js";

export function useCursorPosition(textareaRef: React.RefObject<HTMLTextAreaElement | null>) {
  const cursorIndexRef = useRef(0);

  const virtualElement = useRef<VirtualElement>({
    getBoundingClientRect() {
      const textarea = textareaRef.current;
      if (!textarea) return { top: 0, left: 0, right: 0, bottom: 0, x: 0, y: 0, width: 0, height: 0 };
      const { top, left, lineHeight } = measureCursorPosition(textarea, cursorIndexRef.current);
      return {
        top,
        left,
        right: left,
        bottom: top + lineHeight,
        x: left,
        y: top,
        width: 0,
        height: lineHeight,
      };
    },
    get contextElement() {
      return textareaRef.current ?? undefined;
    },
  });

  const update = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    cursorIndexRef.current = textarea.selectionStart;
  }, [textareaRef]);

  return { virtualElement: virtualElement.current, update };
}
