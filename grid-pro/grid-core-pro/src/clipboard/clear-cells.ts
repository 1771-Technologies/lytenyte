import type { ApiPro, CellSelectionRectPro } from "@1771technologies/grid-types/pro";

export function clearCells<D, E>(api: ApiPro<D, E>, rect: CellSelectionRectPro | undefined | null) {
  const s = api.getState();

  const selectedRects = s.cellSelections.peek();
  if (!rect && selectedRects.length !== 1) return;

  const r = rect ?? selectedRects[0];

  const dataUpdates: Record<string, D> = {};
  for (let rowIndex = r.rowStart; rowIndex < r.rowEnd; rowIndex++) {
    const row = api.rowByIndex(rowIndex);
    if (!row) continue;

    const data = structuredClone(row.data);
    dataUpdates[row.id] = data as D;

    for (let colIndex = r.columnStart; colIndex < r.columnEnd; colIndex++) {
      const column = api.columnByIndex(colIndex);
      if (!column) continue;
      const updater = column.cellEditRowUpdater ?? s.columnBase.peek().cellEditRowUpdater;

      if (updater) updater({ api, column, row, value: null });
      if (!api.rowIsLeaf(row)) continue;

      const fieldKey = column.field ?? column.id;

      if (typeof fieldKey === "string" || typeof fieldKey === "number") {
        // @ts-expect-error this is fine more or less
        data[fieldKey] = null;
      }
    }
  }

  api.rowSetDataMany(dataUpdates);
}
