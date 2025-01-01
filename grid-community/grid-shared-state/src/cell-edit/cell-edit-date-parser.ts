import type { ApiCommunity, ColumnCommunity } from "@1771technologies/grid-types";
import type { CellEditParserParams } from "@1771technologies/grid-types/community";

export const dateParser = <D, E>(
  p: CellEditParserParams<ApiCommunity<D, E>, D, ColumnCommunity<D, E>>,
) => {
  const value = p.value as Date | string;
  if (value == null) return value;

  if (typeof value === "string") return value;
  return value.toISOString().split("T")[0];
};
