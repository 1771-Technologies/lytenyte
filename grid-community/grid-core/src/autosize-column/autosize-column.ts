import type { ApiCore, AutosizeOptionsCore, ColumnCore } from "@1771technologies/grid-types/core";
import type { ApiPro, ColumnPro } from "@1771technologies/grid-types/pro";

export const autosizeColumn = <D, E>(
  api: ApiCore<D, E> | ApiPro<D, E>,
  c: ColumnCore<D, E> | ColumnPro<D, E>,
  opts?: AutosizeOptionsCore,
) => {
  return api.autosizeColumns([c.id], opts);
};
