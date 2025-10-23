import type { PositionGridCell } from "../+types";
import { equal } from "../js-utils/index.js";

export function cellEqual(left: PositionGridCell, right: PositionGridCell) {
  return Boolean(
    (left.rowIndex === right.rowIndex && left.colIndex === right.colIndex) ||
      (left.root && right.root && equal(left.root, right.root)),
  );
}
