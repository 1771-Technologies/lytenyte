import type { CellEditLocation } from "@1771technologies/grid-types/community";

export function cellEditKey(c: CellEditLocation) {
  return `r${c.rowIndex}-c${c.columnIndex}`;
}
