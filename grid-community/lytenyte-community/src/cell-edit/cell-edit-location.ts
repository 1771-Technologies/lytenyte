import type { CellEditLocationCore } from "@1771technologies/grid-types/core";

export function cellEditLocation(c: CellEditLocationCore) {
  return `r${c.rowIndex}-c${c.columnIndex}`;
}
