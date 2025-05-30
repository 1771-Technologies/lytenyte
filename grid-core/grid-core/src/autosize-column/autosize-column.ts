import type {
  ApiCore,
  AutosizeOptionsCore,
  AutosizeResultCore,
  ColumnCore,
} from "@1771technologies/grid-types/core";
import type { ApiPro, ColumnPro } from "@1771technologies/grid-types/pro";

export const autosizeColumn = <D, E>(
  api: ApiCore<D, E> | ApiPro<D, E>,
  c: ColumnCore<D, E> | ColumnPro<D, E>,
  opts?: AutosizeOptionsCore,
): AutosizeResultCore | null => {
  return api.autosizeColumns([c.id], opts);
};
