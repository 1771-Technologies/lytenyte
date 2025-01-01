import type { CellEditParserParams } from "@1771technologies/grid-types/community";
import type { ApiCommunity, ColumnCommunity } from "@1771technologies/grid-types";

export const dateUnparser = <D, E>(
  p: CellEditParserParams<ApiCommunity<D, E>, D, ColumnCommunity<D, E>>,
) => {
  return (p.value as string | Date) instanceof Date
    ? (p.value as Date).toISOString().split("T")[0]
    : p;
};
