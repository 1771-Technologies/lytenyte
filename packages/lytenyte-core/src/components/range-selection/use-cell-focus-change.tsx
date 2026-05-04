import { rectFromGridCellPosition, type PositionUnion } from "@1771technologies/lytenyte-shared";
import { useEffect, useRef } from "react";
import { useFocusReactive } from "../../root/contexts/focus-position.js";
import { useCellRangeSelectionSettings } from "../../root/contexts/cell-range-selection/cell-range-selection-state.js";
import { useCellRangeSelectionActive } from "../../root/contexts/cell-range-selection/cell-range-selection-active.js";
import { equal } from "@1771technologies/js-utils";

export function useCellFocusChange() {
  const [focus] = useFocusReactive();
  const prevRef = useRef<PositionUnion | null>(null);
  const settings = useCellRangeSelectionSettings();
  const { selecting } = useCellRangeSelectionActive();

  useEffect(() => {
    if (!focus || settings.cellSelectionMode === "none") return;

    if (selecting) {
      prevRef.current = focus;
      return;
    }

    if (equal(prevRef.current, focus)) return;
    prevRef.current = focus;

    if (focus.colIndex === 0 && settings.ignoreFirstColumn) return;

    if (
      !settings.cellSelectionMaintainOnNonCellPosition &&
      focus?.kind !== "cell" &&
      focus?.kind !== "full-width"
    ) {
      settings.onCellSelectionChange([]);
    } else if (focus.kind === "cell" || focus.kind === "full-width") {
      const rect =
        focus.kind === "full-width"
          ? {
              rowStart: focus.rowIndex,
              rowEnd: focus.rowIndex + 1,
              columnStart: focus.colIndex,
              columnEnd: focus.colIndex + 1,
            }
          : rectFromGridCellPosition(focus);

      settings.onCellSelectionChange([rect]);
    }
  }, [focus, selecting, settings]);
}
