import type { LayoutMap } from "@1771technologies/lytenyte-shared";
import type { EditActivePosition, GridAtom, GridAtomReadonly, PositionUnion } from "../+types";

export interface InternalAtoms {
  readonly headerRows: GridAtomReadonly<number>;
  readonly headerCols: GridAtomReadonly<number>;
  readonly headerHeightTotal: GridAtomReadonly<number>;
  readonly xScroll: GridAtom<number>;
  readonly yScroll: GridAtom<number>;
  readonly refreshKey: GridAtom<number>;

  readonly layout: GridAtomReadonly<LayoutMap>;

  // For focus management
  readonly focusActive: GridAtom<PositionUnion | null>;
  readonly focusPrevColIndex: GridAtom<number | null>;
  readonly focusPrevRowIndex: GridAtom<number | null>;

  // For Cell Editing
  readonly editActivePos: GridAtom<EditActivePosition<any> | null>;
  readonly editData: GridAtom<any>;
  readonly editValidation: GridAtom<Record<string, any> | boolean>;

  // Row Height management
  readonly rowAutoHeightCache: GridAtom<Record<number, number>>;
  readonly rowDetailAutoHeightCache: GridAtom<Record<number, number>>;

  // Row selection
  readonly rowSelectionPivot: GridAtom<string | null>;
}
