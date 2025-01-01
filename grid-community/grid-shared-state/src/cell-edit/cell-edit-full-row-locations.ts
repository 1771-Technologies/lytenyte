import type { ApiCommunity, ApiEnterprise } from "@1771technologies/grid-types";
import type { CellEditLocation, RowNode } from "@1771technologies/grid-types/community";

export function cellEditFullRowLocations<D, E>(
  a: ApiCommunity<D, E> | ApiEnterprise<D, E>,
  l: CellEditLocation,
  row: RowNode<D>,
) {
  const api = a as ApiCommunity<D, E>;

  const columns = api.getState().columnsVisible.peek();

  const locations: CellEditLocation[] = [];

  for (let i = 0; i < columns.length; i++) {
    const column = columns[i];
    const canEdit = api.cellEditPredicate(row, column);

    if (canEdit) locations.push({ rowIndex: l.rowIndex, columnIndex: i });
  }

  return locations;
}
