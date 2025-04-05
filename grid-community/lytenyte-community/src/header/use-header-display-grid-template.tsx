import type { ColumnHeaderHeightProperty } from "@1771technologies/grid-types/core";
import { useMemo } from "react";

export function useHeaderDisplayGridTemplate(
  levelsCount: number,
  headerHeight: ColumnHeaderHeightProperty,
  groupHeaderHeight: ColumnHeaderHeightProperty,
  floatingRowEnabled: boolean,
  floatingRowHeight: ColumnHeaderHeightProperty,
) {
  const gridTemplateRows = useMemo(() => {
    const groupHeight = typeof groupHeaderHeight === "number" ? `${groupHeaderHeight}px` : "auto";
    const height = typeof headerHeight === "number" ? `${headerHeight}px` : "auto";

    const template: string[] = Array.from({ length: levelsCount }, () => groupHeight);
    template.push(height);

    if (floatingRowEnabled) {
      const floatingHeight =
        typeof floatingRowHeight === "number" ? `${floatingRowHeight}px` : "auto";
      template.push(floatingHeight);
    }

    return template.join(" ");
  }, [floatingRowEnabled, floatingRowHeight, groupHeaderHeight, headerHeight, levelsCount]);

  return gridTemplateRows;
}
