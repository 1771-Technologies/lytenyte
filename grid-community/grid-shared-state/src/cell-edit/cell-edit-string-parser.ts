import type { ApiCommunity, ColumnCommunity } from "@1771technologies/grid-types";
import type { CellEditParserParams } from "@1771technologies/grid-types/community";

export const stringParser = <D, E>(
  p: CellEditParserParams<ApiCommunity<D, E>, D, ColumnCommunity<D, E>>,
) => {
  if (p.value == null) return p.value;
  return String(p.value);
};
