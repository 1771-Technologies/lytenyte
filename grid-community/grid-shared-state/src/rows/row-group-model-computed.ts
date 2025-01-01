import { computed, signal } from "@1771technologies/cascada";
import { rowCleanRowGroupModel } from "@1771technologies/grid-core";
import type { ApiCommunity, ApiEnterprise } from "@1771technologies/grid-types";

export function rowGroupModelComputed<D, E>(
  model: string[],
  api: ApiEnterprise<D, E> | ApiCommunity<D, E>,
) {
  const model$ = signal(model);

  return computed(
    () => {
      const sx = api.getState();
      const columns = sx.columns.get();

      const model = rowCleanRowGroupModel(model$.get(), columns, api);

      return model;
    },
    (v) => model$.set(v),
  );
}
