import type { InternalAtoms } from "../+types";
import type { Column, Grid, GridApi } from "../../+types";

export const makeEditIsCellActive = (
  grid: Grid<any> & { internal: InternalAtoms },
): GridApi<any>["editIsCellActive"] => {
  return (params) => {
    const active = grid.internal.editActivePos.get();

    if (!active) return false;
    const meta = grid.state.columnMeta.get();

    let column: Column<any> | undefined;
    if (typeof params.column === "string") column = meta.columnLookup.get(params.column);
    else if (typeof params.column === "number") column = meta.columnsVisible.at(params.column);
    else column = meta.columnsVisible.find((c) => c.id === (params.column as Column<any>).id);

    if (!column) return false;

    const colIndex = meta.columnsVisible.indexOf(column);
    const cell = grid.api.cellRoot(params.rowIndex, colIndex);

    if (!cell || cell.kind === "full-width") return false;

    return active.column.id === column.id && active.rowIndex === params.rowIndex;
  };
};
