import type { CellEditLocation } from "@1771technologies/grid-types/core";

export function cellEditLocation(c: CellEditLocation) {
  return `r${c.rowIndex}-c${c.columnIndex}`;
}
