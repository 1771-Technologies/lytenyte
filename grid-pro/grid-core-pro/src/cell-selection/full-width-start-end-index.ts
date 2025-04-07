import type { ApiPro } from "@1771technologies/grid-types/pro";

export function fullWidthStartEndIndex<D, E>(api: ApiPro<D, E>) {
  const s = api.getState();

  const lastIndex = s.columnsVisible.peek().length;

  return [0, lastIndex];
}
