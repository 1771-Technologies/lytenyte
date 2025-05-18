import type { CellEditParserParamsCore } from "@1771technologies/grid-types/core";

export const numberParser = <D, E>(p: CellEditParserParamsCore<D, E>) => {
  const value = p.value as number | string;
  if (value == null) return value;
  if (typeof value === "number") return value;

  return Number.parseFloat(value);
};
