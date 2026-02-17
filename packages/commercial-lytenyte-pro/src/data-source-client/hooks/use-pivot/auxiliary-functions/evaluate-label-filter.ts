import type { LabelFilter } from "../../../use-client-data-source";

export function evaluateLabelFilter(
  labelFilter: null | undefined | (LabelFilter | null)[],
  path: (string | null)[] | null,
) {
  if (!labelFilter?.length || !path?.length) return true;

  return labelFilter.every((f, i) => {
    if (!f || i >= path.length) return true;

    return f(path[i]);
  });
}
