import type {
  ApiCommunity,
  ApiEnterprise,
  ColumnCommunity,
  ColumnEnterprise,
} from "@1771technologies/grid-types";
import { itemsWithIdToMap } from "@1771technologies/js-utils";

export function rowCleanRowGroupModel<D, E>(
  model: string[],
  columns: ColumnCommunity<D, E>[] | ColumnEnterprise<D, E>[],
  api: ApiEnterprise<D, E> | ApiCommunity<D, E>,
): string[] {
  const seen = new Set<string>();
  api = api as ApiCommunity<D, E>;
  columns = columns as ColumnCommunity<D, E>[];

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
