import { signal } from "@1771technologies/react-cascada";
import { rowCleanRowGroupModel } from "@1771technologies/grid-core";
import type { ApiCommunity, ApiEnterprise } from "@1771technologies/grid-types";
import { equal } from "@1771technologies/js-utils";

export function rowGroupModelComputed<D, E>(
  model: string[],
  api: ApiEnterprise<D, E> | ApiCommunity<D, E>,
) {
  const model$ = signal(model, {
    equal: (l, r) => {
      return equal(l, r);
    },
    bind: (v) => {
      const sx = api.getState();
      const columns = sx.columns.get();

      const model = rowCleanRowGroupModel(v, columns, api);
      return model;
    },
    postUpdate: () => {
      api.getState().columns.set((prev: any[]) => [...prev]);
    },
  });

  return model$;
}
