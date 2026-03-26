import { equal, rectFromGridCellPosition, type PositionUnion } from "@1771technologies/lytenyte-shared";
import { useEffect, useRef } from "react";
import { useRangeSelectionSettings } from "../../root/contexts/range-selection/range-selection-context.js";
import { useRangeActiveSelection } from "../../root/contexts/range-selection/range-selection-active-context.js";
import { usePosition } from "../../root/contexts/position-context.js";

export function useCellFocusChange() {
  const focus = usePosition().get();
  const prevRef = useRef<PositionUnion | null>(null);
  const settings = useRangeSelectionSettings();
  const { selecting } = useRangeActiveSelection();

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
