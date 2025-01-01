import type {
  ApiCommunity,
  ApiEnterprise,
  ColumnCommunity,
  ColumnEnterprise,
} from "@1771technologies/grid-types";
import type { AutosizeOptions } from "@1771technologies/grid-types/community";

export const autosizeColumn = <D, E>(
  api: ApiCommunity<D, E> | ApiEnterprise<D, E>,
  c: ColumnCommunity<D, E> | ColumnEnterprise<D, E>,
  opts?: AutosizeOptions,
) => {
  return api.autosizeColumns([c.id], opts);
};
