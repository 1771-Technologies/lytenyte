import type { ApiCommunity, ApiEnterprise } from "@1771technologies/grid-types";
import { signal } from "@1771technologies/react-cascada";

export function rowSelectionComputed<D, E>(
  init: Set<string>,
  api: ApiCommunity<D, E> | ApiEnterprise<D, E>,
) {
  const selected = signal(init, {
    postUpdate: () => {
      api.rowRefresh();
    },
  });

  return selected;
}
