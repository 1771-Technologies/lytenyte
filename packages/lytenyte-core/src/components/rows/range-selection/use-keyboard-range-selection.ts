import type { KeyboardEventHandler } from "react";
import { useEvent } from "../../../internal.js";
import { useRoot } from "../../../root/root-context.js";
import { useCellSelection, useCellSelectionSettings } from "../../../root/contexts/cell-selection-context.js";
import { expandSelectionUp } from "./expand-selection-up.js";
import { expandSelectionDown } from "./expand-selection-down.js";
import { expandSelectionStart } from "./expand-selection-start.js";
import { expandSelectionEnd } from "./expand-selection-end.js";
import { rectFromGridCellPosition } from "@1771technologies/lytenyte-shared";

export function useKeyboardRangeSelection(): KeyboardEventHandler<HTMLDivElement> {
  const { api, focusActive, view, source, rtl } = useRoot();
  const { cellSelections } = useCellSelection();
  const settings = useCellSelectionSettings();

  const rowCount = source.useRowCount();

  return useEvent((e) => {
    if (!e.shiftKey || settings.cellSelectionMode === "none") return;

    const pos = focusActive.get();
    if (!pos || pos.kind !== "cell") return;

    const meta = e.ctrlKey || e.metaKey;
    const key = e.key;

    const isUp = key === "ArrowUp";
    const isDown = key === "ArrowDown";
    const isStart = key === (rtl ? "ArrowRight" : "ArrowLeft");
    const isEnd = key === (rtl ? "ArrowLeft" : "ArrowRight");

    if (!isUp && !isDown && !isStart && !isEnd) return;

    e.preventDefault();
    e.stopPropagation();

    // Bootstrap a single-cell selection if none exists
    let selections = cellSelections;
    if (selections.length === 0) {
      selections = [rectFromGridCellPosition(pos)];
      settings.onCellSelectionChange(selections);
    }

    if (isUp) expandSelectionUp(api, selections, settings.onCellSelectionChange, meta, pos, rowCount);
    else if (isDown)
      expandSelectionDown(api, selections, settings.onCellSelectionChange, meta, pos, rowCount);
    else if (isStart)
      expandSelectionStart(
        api,
        selections,
        settings.onCellSelectionChange,
        meta,
        pos,
        settings.ignoreFirstColumn,
        view,
      );
    else if (isEnd) expandSelectionEnd(api, selections, settings.onCellSelectionChange, meta, pos, view);
  });
}
