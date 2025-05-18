import type { ApiCore, ColumnCore } from "@1771technologies/grid-types/core";
import type { ApiPro, ColumnPro } from "@1771technologies/grid-types/pro";
import { itemsWithIdToMap } from "@1771technologies/js-utils";

export function rowCleanRowGroupModel<D, E>(
  model: string[],
  columns: ColumnCore<D, E>[] | ColumnPro<D, E>[],
  api: ApiPro<D, E> | ApiCore<D, E>,
): string[] {
  const seen = new Set<string>();
  api = api as ApiCore<D, E>;
  columns = columns as ColumnCore<D, E>[];

  const lookup = itemsWithIdToMap(columns);

  const cleanModel = model.filter((id) => {
    const column = lookup.get(id);

    // Remove duplicates
    if (seen.has(id)) return false;
    seen.add(id);

    return column && !api.columnIsGridGenerated(column) && api.columnIsRowGroupable(column);
  });

  return cleanModel;
}
