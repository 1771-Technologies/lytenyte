import type { PositionUnion } from "../+types";
import { equal } from "../js-utils/index.js";
import { cellEqual } from "./cell-equal.js";

export function positionsEqual(p: PositionUnion | null, c: PositionUnion | null) {
  if ((p?.kind === "cell" && c?.kind === "cell" && cellEqual(p, c)) || equal(p, c)) return true;
  if (p?.kind === "full-width" && c?.kind === "full-width" && c.rowIndex === p.rowIndex) return true;
  if (p?.kind === "detail" && c?.kind === "detail" && c.rowIndex === p.rowIndex) return true;

  return equal(p, c);
}
