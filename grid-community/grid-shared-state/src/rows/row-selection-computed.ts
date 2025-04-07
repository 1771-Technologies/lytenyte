import type { ApiCore } from "@1771technologies/grid-types/core";
import type { ApiPro } from "@1771technologies/grid-types/pro";
import { signal } from "@1771technologies/react-cascada";

export function rowSelectionComputed<D, E>(init: Set<string>, api: ApiCore<D, E> | ApiPro<D, E>) {
  const selected = signal(init, {
    postUpdate: () => {
      api.rowRefresh();
    },
  });

  return selected;
}
