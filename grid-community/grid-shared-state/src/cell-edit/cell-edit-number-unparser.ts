import type { CellEditParserParamsCore } from "@1771technologies/grid-types/core";

export const numberUnparser = <D, E>(p: CellEditParserParamsCore<D, E>) => {
  return String(p.value);
};
