import type { PositionGridCell } from "../+types";
import { equal } from "@1771technologies/js-utils";

export function cellEqual(left: PositionGridCell, right: PositionGridCell) {
  return Boolean(
    (left.rowIndex === right.rowIndex && left.colIndex === right.colIndex) ||
      (left.root && right.root && equal(left.root, right.root)),
  );
}
