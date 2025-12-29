import { useMemo } from "react";
import { sizeFromCoord, type ColumnView } from "@1771technologies/lytenyte-shared";

export function useHeaderColTemplate(meta: ColumnView, xPositions: Uint32Array) {
  const countBeforeEnd = meta.centerCount + meta.startCount;

  const gridTemplateColumns = useMemo(() => {
    const items: string[] = [];
    for (let i = 0; i < countBeforeEnd; i++) {
      items.push(`${sizeFromCoord(i, xPositions)}px`);
    }

    items.push("1fr");

    const endCount = xPositions.length - countBeforeEnd - 1;
    for (let i = 0; i < endCount; i++) {
      items.push(`${sizeFromCoord(i + countBeforeEnd, xPositions)}px`);
    }

    return items.join(" ");
  }, [countBeforeEnd, xPositions]);

  return gridTemplateColumns;
}
