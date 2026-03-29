import type { KeyboardEventHandler } from "react";
import { useEvent } from "../../internal.js";
import { useRoot } from "../../root/root-context.js";
import { expandDirectionFromKey, expandRectsInDirection } from "@1771technologies/lytenyte-shared";
import { useFocusNonReactive } from "../../root/contexts/focus-position.js";
import {
  useCellRangeSelection,
  useCellRangeSelectionSettings,
} from "../../root/contexts/cell-range-selection/cell-range-selection-state.js";
import { useAPI } from "../../root/contexts/api-provider.js";

export function useKeyboardRangeSelection(): KeyboardEventHandler<HTMLDivElement> {
  const { view, source, rtl } = useRoot();
  const { cellSelections } = useCellRangeSelection();
  const settings = useCellRangeSelectionSettings();
  const focusActive = useFocusNonReactive();
  const api = useAPI();

  const rowCount = source.useRowCount();

  return useEvent((e) => {
    if (!e.shiftKey || settings.cellSelectionMode === "none") return;

    const pos = focusActive.get();
    if (!pos || pos.kind !== "cell") return;

    const direction = expandDirectionFromKey(e.key, rtl);
    if (!direction) return;

    e.preventDefault();
    e.stopPropagation();

    const rect = expandRectsInDirection({
      scrollIntoView: api.scrollIntoView,
      cellRoot: api.cellRoot,
      selections: cellSelections,
      meta: e.ctrlKey || e.metaKey,
      pos,
      rowCount,
      view,
      direction,
      ignoreFirst: settings.ignoreFirstColumn,
    });

    if (rect) settings.onCellSelectionChange(rect);
  });
}
