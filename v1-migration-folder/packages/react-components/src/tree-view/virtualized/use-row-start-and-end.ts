import { clamp } from "@1771technologies/lytenyte-js-utils";
import type { RectReadOnly } from "@1771technologies/lytenyte-react-hooks";
import { useEffect, useMemo, useState } from "react";

export function useRowStartAndEnd(
  panel: HTMLElement | null | undefined,
  itemHeight: number,
  bounds: RectReadOnly,
  size: number,
) {
  const [startOffset, setStartOffset] = useState(0);
  const [rowStart, rowEnd] = useMemo(() => {
    if (!panel) return [0, 0];
    const start = startOffset;
    const end = start + Math.ceil(bounds.height / itemHeight) + 1;

    return [clamp(0, start - 3, size), clamp(0, end + 3, size)];
  }, [bounds.height, itemHeight, panel, size, startOffset]);

  useEffect(() => {
    if (!panel) return;

    const handleViewChange = () => {
      const scrollTop = panel.scrollTop;
      const start = Math.floor(scrollTop / itemHeight);
      setStartOffset(start);
    };

    handleViewChange();
    panel.addEventListener("scroll", handleViewChange);

    return () => {
      panel.removeEventListener("scroll", handleViewChange);
    };
  }, [itemHeight, panel]);

  return [rowStart, rowEnd];
}
