import type { CellEditParserParamsCore } from "@1771technologies/grid-types/core";

export const dateUnparser = <D, E>(p: CellEditParserParamsCore<D, E>) => {
  return (p.value as string | Date) instanceof Date
    ? (p.value as Date).toISOString().split("T")[0]
    : p;
};
