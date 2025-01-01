import type { CellEditParserParams } from "@1771technologies/grid-types/community";
import type { ApiCommunity, ColumnCommunity } from "@1771technologies/grid-types";

export const numberUnparser = <D, E>(
  p: CellEditParserParams<ApiCommunity<D, E>, D, ColumnCommunity<D, E>>,
) => {
  return String(p.value);
};
