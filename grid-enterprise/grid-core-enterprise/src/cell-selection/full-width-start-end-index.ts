import type { ApiEnterprise } from "@1771technologies/grid-types";

export function fullWidthStartEndIndex<D, E>(api: ApiEnterprise<D, E>) {
  const s = api.getState();

  const lastIndex = s.columnsVisible.peek().length;

  return [0, lastIndex];
}
