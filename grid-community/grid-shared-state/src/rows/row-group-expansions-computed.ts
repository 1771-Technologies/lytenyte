import type { ApiCommunity, ApiEnterprise } from "@1771technologies/grid-types";
import type { rowGroupExpansions } from "@1771technologies/grid-types/community";
import { signal } from "@1771technologies/react-cascada";

export function rowGroupExpansionsComputed<D, E>(
  expansions: rowGroupExpansions,
  api: ApiCommunity<D, E> | ApiEnterprise<D, E>,
) {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastExp: null | rowGroupExpansions = null;
  const exp = signal(expansions, {
    postUpdate: () => {
      if (timeoutId) clearTimeout(timeoutId);

      timeoutId = setTimeout(() => {
        const expansions = exp.peek();

        if (expansions === lastExp) {
          timeoutId = null;
          return;
        }

        const entries = Object.entries(expansions).filter(([key]) => api.rowById(key) != null);
        const cleanExpansions = Object.fromEntries(entries);

        lastExp = cleanExpansions;
        exp.set(cleanExpansions);
        timeoutId = null;
      }, 50);
    },
  });

  return exp;
}
