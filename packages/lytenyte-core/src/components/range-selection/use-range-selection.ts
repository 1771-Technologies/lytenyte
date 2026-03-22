import { type MouseEventHandler } from "react";
import { useEvent } from "../../internal.js";
import { useGridId } from "../../root/contexts/grid-id.js";
import { handleRangeSelect } from "@1771technologies/lytenyte-shared";
import { useCellSelection, useCellSelectionSettings } from "../../root/contexts/cell-selection-context.js";
import { useActiveRangeSelection } from "../../root/contexts/active-range-context.js";
import { useGridSections } from "../../root/contexts/grid-sections-context.js";
import { useRoot } from "../../root/root-context.js";
import type { API } from "../../types/api.js";

export function useRangeSelection(
  mouseDown: MouseEventHandler<HTMLDivElement> | undefined,
  viewport: HTMLElement | null,
  rtl: boolean,
  api: API,
) {
  const gridId = useGridId();
  const settings = useCellSelectionSettings();

  const { cellSelections } = useCellSelection();
  const { setActiveRange, setDeselect, setSelecting } = useActiveRangeSelection();

  const gridSections = useGridSections();
  const { focusActive } = useRoot();

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
