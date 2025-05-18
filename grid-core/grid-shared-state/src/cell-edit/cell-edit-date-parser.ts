import type { CellEditParserParamsCore } from "@1771technologies/grid-types/core";

export const dateParser = <D, E>(p: CellEditParserParamsCore<D, E>) => {
  const value = p.value as Date | string;
  if (value == null) return value;

  if (typeof value === "string") return value;
  return value.toISOString().split("T")[0];
};
