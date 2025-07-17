import type { Column, ColumnMeta, Grid, GridApi } from "../../+types";

export const makeColumnMove = (grid: Grid<any>): GridApi<any>["columnMove"] => {
  return (params) => {
    const meta = grid.state.columnMeta.get();
    const errorRef = { current: false };
    const colSet = new Set(
      params.moveColumns.map((c) => {
        return resolveColumn(c, errorRef, meta);
      }),
    );

    const dest = resolveColumn(params.moveTarget, errorRef, meta);

    if (errorRef.current) return;
    if (colSet.has(dest)) {
      console.error(`Destination column cannot be in the move columns`);
      return;
    }

    const columns = grid.state.columns.get();

    const columnsToMove = columns.filter((c) => colSet.has(c.id));
    const nextColumns = columns.filter((c) => !colSet.has(c.id));
    const indexOfDest = nextColumns.findIndex((c) => c.id === dest);

    const destCol = nextColumns[indexOfDest];

    let stop = false;
    grid.api.eventFire("columnMoveBegin", {
      grid,
      before: !!params.before,
      moveColumns: columnsToMove,
      moveTarget: destCol,
      preventDefault: () => {
        stop = true;
      },
      updatePinState: !!params.updatePinState,
    });

    if (stop) return;

    const offset = params.before ? 0 : 1;
    nextColumns.splice(indexOfDest + offset, 0, ...columnsToMove);
    grid.state.columns.set(nextColumns);

    if (params.updatePinState) {
      const updates = Object.fromEntries(
        columnsToMove.map((c) => [c.id, { pin: destCol.pin ?? null }]),
      );
      grid.api.columnUpdate(updates);
    }

    grid.api.eventFire("columnMoveEnd", {
      grid,
      before: !!params.before,
      moveColumns: columnsToMove,
      moveTarget: destCol,
      updatePinState: !!params.updatePinState,
    });
  };
};

function resolveColumn(
  c: string | number | Column<any>,
  errorRef: { current: boolean },
  meta: ColumnMeta<any>,
) {
  if (typeof c === "string") {
    if (!meta.columnLookup.has(c)) {
      errorRef.current = true;
      console.error(`Attempt to move invalid column ${c}`);
    }
    return c;
  }
  if (typeof c === "number") {
    const col = meta.columnsVisible.at(c);
    if (!col) {
      errorRef.current = true;
      console.error(`Attempt to move invalid column at index ${c}`);
    }
    return col?.id;
  }

  if (!meta.columnLookup.has(c.id)) {
    errorRef.current = true;
    console.error(`Attempt to move invalid column ${c.id}`);
  }
  return c.id;
}
