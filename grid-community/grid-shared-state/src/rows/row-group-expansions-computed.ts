import type { ApiCommunity, ApiEnterprise } from "@1771technologies/grid-types";
import type { rowGroupExpansions } from "@1771technologies/grid-types/community";
import { signal } from "@1771technologies/react-cascada";

export function rowGroupExpansionsComputed<D, E>(
  expansions: rowGroupExpansions,
  api: ApiCommunity<D, E> | ApiEnterprise<D, E>,
) {
  return signal(expansions, {
    bind: (v) => {
      const keys = Object.keys(v);

      const keysToKeep: number[] = [];
      const model = api.getState().rowGroupModel.peek();
      for (let i = 0; i < keys.length; i++) {
        const key = Number.parseInt(keys[i]);
        if (Number.isNaN(key) || key >= model.length) continue;

        keysToKeep.push(key);
      }

      const final = Object.fromEntries(keysToKeep.map((c) => [c, v[c]]));

      return final;
    },
  });
}
