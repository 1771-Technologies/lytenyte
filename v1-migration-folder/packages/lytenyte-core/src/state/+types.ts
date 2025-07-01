import type { GridAtom, GridAtomReadonly } from "../+types";

export interface InternalAtoms {
  readonly headerRows: GridAtomReadonly<number>;
  readonly headerCols: GridAtomReadonly<number>;
  readonly headerHeightTotal: GridAtomReadonly<number>;
  readonly xScroll: GridAtom<number>;
  readonly yScroll: GridAtom<number>;
  readonly refreshKey: GridAtom<number>;
}
