import type { ApiCore } from "@1771technologies/grid-types/core";
import type { ApiPro, RowGroupDisplayModePro } from "@1771technologies/grid-types/pro";
import { signal } from "@1771technologies/react-cascada";

export function rowDisplayModeComputed<D, E>(
  displayMode: RowGroupDisplayModePro,
  api: ApiPro<D, E> | ApiCore<D, E>,
) {
  return signal(displayMode, {
    postUpdate: () => {
      api.getState().columns.set((prev: any[]) => [...prev]);
    },
  });
}
