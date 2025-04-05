import type { ApiCommunity, ApiEnterprise } from "@1771technologies/grid-types";
import type { RowGroupDisplayMode } from "@1771technologies/grid-types/core";
import { signal } from "@1771technologies/react-cascada";

export function rowDisplayModeComputed<D, E>(
  displayMode: RowGroupDisplayMode,
  api: ApiCommunity<D, E> | ApiEnterprise<D, E>,
) {
  return signal(displayMode, {
    postUpdate: () => {
      api.getState().columns.set((prev: any[]) => [...prev]);
    },
  });
}
