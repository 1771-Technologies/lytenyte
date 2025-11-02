import type { PositionFullWidthRow, PositionGridCell, PositionUnion } from "../+types.js";

export type BeforeKeyFn = () => void;
export type AfterKeyFn = () => void;
export type ScrollIntoViewFn = (p: { row?: number; column?: number; behavior: "instant" }) => void;
export type RootCellFn = (r: number, c: number) => PositionGridCell | PositionFullWidthRow | null;
export type PositionState = {
  get: () => PositionUnion | null;
  set: (p: PositionUnion | null | ((prev: PositionUnion | null) => PositionUnion | null)) => void;
};
