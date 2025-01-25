import { useCallback, useMemo } from "react";
import { useGrid } from "../use-grid";
import { getEditRows } from "./cell-get-edit-rows";
import { CellEditorRow } from "./cell-edit-row";

export function CellEditorTop() {
  const { state } = useGrid();
  const p = state.internal.cellEditActiveEdits.use();

  const topCount = state.internal.rowTopCount.use();
  const locations = useMemo(() => {
    return getEditRows(p, (l) => l.rowIndex < topCount);
  }, [p, topCount]);

  const yPositions = state.internal.rowPositions.use();
  const getY = useCallback((i: number) => yPositions[i], [yPositions]);

  return (
    <>
      {locations.map(([key, locations]) => {
        return <CellEditorRow getY={getY} locations={locations} key={key} />;
      })}
    </>
  );
}

export function CellEditorCenter() {
  const { state } = useGrid();

  const yPositions = state.internal.rowPositions.use();
  const topCount = state.internal.rowTopCount.use();

  const getY = useCallback((i: number) => yPositions[i], [yPositions]);

  const p = state.internal.cellEditActiveEdits.use();

  const botCount = state.internal.rowBottomCount.use();
  const firstBotIndex = yPositions.length - 2 - botCount;

  const locations = useMemo(() => {
    return getEditRows(p, (l) => l.rowIndex >= topCount && l.rowIndex < firstBotIndex);
  }, [firstBotIndex, p, topCount]);

  return (
    <>
      {locations.map(([key, locations]) => {
        return <CellEditorRow getY={getY} locations={locations} key={key} />;
      })}
    </>
  );
}

export function CellEditorBottom() {
  const { state } = useGrid();

  const yPositions = state.internal.rowPositions.use();
  const topCount = state.internal.rowTopCount.use();

  const getY = useCallback((i: number) => yPositions[i], [yPositions]);

  const p = state.internal.cellEditActiveEdits.use();

  const botCount = state.internal.rowBottomCount.use();
  const firstBotIndex = yPositions.length - 2 - botCount;

  const locations = useMemo(() => {
    return getEditRows(p, (l) => l.rowIndex >= topCount && l.rowIndex < firstBotIndex);
  }, [firstBotIndex, p, topCount]);

  return (
    <>
      {locations.map(([key, locations]) => {
        return <CellEditorRow getY={getY} locations={locations} key={key} />;
      })}
    </>
  );
}
