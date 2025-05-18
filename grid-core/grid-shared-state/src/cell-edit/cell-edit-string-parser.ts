import type { CellEditParserParamsCore } from "@1771technologies/grid-types/core";

export const stringParser = <D, E>(p: CellEditParserParamsCore<D, E>) => {
  if (p.value == null) return p.value;
  return String(p.value);
};
