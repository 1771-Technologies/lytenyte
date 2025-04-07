import type { ApiCore, CellEditLocationCore, RowNodeCore } from "@1771technologies/grid-types/core";
import type { ApiPro } from "@1771technologies/grid-types/pro";

export function cellEditFullRowLocations<D, E>(
  a: ApiPro<D, E> | ApiCore<D, E>,
  l: CellEditLocationCore,
  row: RowNodeCore<D>,
): CellEditLocationCore[] {
  const api = a as ApiCore<D, E>;

  const columns = api.getState().columnsVisible.peek();

  const locations: CellEditLocationCore[] = [];

  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    const canEdit = api.cellEditPredicate(row, column);

    if (canEdit) locations.push({ rowIndex: l.rowIndex, columnIndex: i });
  }

  return locations;
}
