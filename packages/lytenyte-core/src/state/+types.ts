import type { LayoutState, WriteSignal } from "@1771technologies/lytenyte-shared";
import type {
  Column,
  EditActivePosition,
  GridAtom,
  GridAtomReadonly,
  HeaderGroupCellLayout,
  PositionUnion,
} from "../+types";

export interface InternalAtoms {
  readonly headerRows: GridAtomReadonly<number>;
  readonly headerCols: GridAtomReadonly<number>;
  readonly headerHeightTotal: GridAtomReadonly<number>;
  readonly xScroll: GridAtom<number>;
  readonly yScroll: GridAtom<number>;

  readonly layout: LayoutState;

  readonly hasSpans: GridAtomReadonly<boolean>;

  readonly colBounds: GridAtomReadonly<[number, number]>;

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

  readonly rowGroupColumnState: GridAtom<Record<string, Partial<Column<any>>>>;

  // Row selection
  readonly rowSelectedIds: WriteSignal<Set<string>>;
  readonly rowSelectionPivot: GridAtom<string | null>;
  readonly rowSelectionLastWasDeselect: GridAtom<boolean>;

  // Column Moving
  readonly draggingHeader: GridAtom<HeaderGroupCellLayout | null>;
}
