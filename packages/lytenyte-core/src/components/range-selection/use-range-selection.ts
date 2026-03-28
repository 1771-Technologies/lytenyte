import { type MouseEventHandler } from "react";
import { useEvent } from "../../internal.js";
import { useGridIdContext } from "../../root/contexts/grid-id.js";
import { handleRangeSelect } from "@1771technologies/lytenyte-shared";
import { useGridSections } from "../../root/contexts/grid-sections-context.js";
import type { API } from "../../types/api.js";
import { useFocusNonReactive } from "../../root/contexts/focus-position.js";
import {
  useCellRangeSelection,
  useCellRangeSelectionSettings,
} from "../../root/contexts/cell-range-selection/cell-range-selection-state.js";
import { useCellRangeSelectionActive } from "../../root/contexts/cell-range-selection/cell-range-selection-active.js";

export function useRangeSelection(
  mouseDown: MouseEventHandler<HTMLDivElement> | undefined,
  viewport: HTMLElement | null,
  rtl: boolean,
  api: API,
) {
  const gridId = useGridIdContext();
  const settings = useCellRangeSelectionSettings();

  const { cellSelections } = useCellRangeSelection();
  const { setActiveRange, setDeselect, setSelecting } = useCellRangeSelectionActive();

  const gridSections = useGridSections();
  const focusActive = useFocusNonReactive();

  const onMouseDown: MouseEventHandler<HTMLDivElement> = useEvent((e) => {
    mouseDown?.(e);
    if (
      !viewport ||
      settings.cellSelectionMode === "none" ||
      e.isPropagationStopped() ||
      e.isDefaultPrevented()
    )
      return;

    handleRangeSelect({
      ev: e.nativeEvent,
      anchorRef: { get: () => settings.anchorRef.current, set: (v) => (settings.anchorRef.current = v) },
      cellSelections,
      clearOnSelfSelect: settings.cellSelectionClearOnSelf,
      currentFocus: focusActive.get(),
      gridId,
      gridSections,
      ignoreFirst: settings.ignoreFirstColumn,
      isMultiRange: settings.cellSelectionMode === "multi-range",
      onActiveRangeChange: setActiveRange,
      onDeselectChange: setDeselect,
      onSelectionChange: settings.onCellSelectionChange,
      rtl,
      viewport,
      cellRoot: api.cellRoot,
      onDragChange: setSelecting,
    });
  });

  return onMouseDown;
}
