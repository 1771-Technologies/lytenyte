import { FULL_WIDTH_MAP } from "../+constants.layout.js";
import type { Column, RowColTuple } from "../+types.layout.js";

export function isFullWidthMap(m: Map<Column, RowColTuple>) {
  return m === FULL_WIDTH_MAP;
}
