import { useState, useCallback } from "react";
import type { CursorCoordinates } from "../types";
import { measureCursorPosition } from "./measure-cursor-at-pointer.js";

export function useCursorPosition(textareaRef: React.RefObject<HTMLTextAreaElement | null>) {
  const [coordinates, setCoordinates] = useState<CursorCoordinates>({
    top: 0,
    left: 0,
    lineHeight: 22,
  });

  const update = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const coords = measureCursorPosition(textarea, textarea.selectionStart);
    setCoordinates(coords);
  }, [textareaRef]);

  return { coordinates, update };
}
