import type { LayoutState } from "@1771technologies/lytenyte-shared";
import type {
  Column,
  DataRect,
  EditActivePosition,
  GridAtom,
  GridAtomReadonly,
  HeaderGroupCellLayout,
  PositionUnion,
  VirtualTarget,
} from "../+types";
import type { Atom, createStore } from "@1771technologies/atom";

export interface InternalAtoms {
  readonly headerRows: GridAtomReadonly<number>;
  readonly headerCols: GridAtomReadonly<number>;
  readonly headerHeightTotal: GridAtomReadonly<number>;
  readonly xScroll: GridAtom<number>;
  readonly yScroll: GridAtom<number>;
  readonly refreshKey: GridAtom<number>;

  readonly layout: LayoutState;

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
  readonly rowSelectedIds: Atom<Set<string>>;
  readonly rowSelectionPivot: GridAtom<string | null>;
  readonly rowSelectionLastWasDeselect: GridAtom<boolean>;

  readonly rowGroupColumnState: GridAtom<Record<string, Partial<Column<any>>>>;

  // Column Moving
  readonly draggingHeader: GridAtom<HeaderGroupCellLayout | null>;

  // Dialog & Popover frames
  readonly dialogFrames: GridAtom<Record<string, any>>;
  readonly popoverFrames: GridAtom<
    Record<string, { target: HTMLElement | VirtualTarget; context: any }>
  >;

  // Cell Selection
  readonly cellSelectionPivot: GridAtom<DataRect | null>;
  readonly cellSelectionAdditiveRects: GridAtom<DataRect[] | null>;
  readonly cellSelectionIsDeselect: GridAtom<boolean>;
  readonly cellSelectionSplits: GridAtomReadonly<DataRect[]>;

  readonly store: ReturnType<typeof createStore>;
}
