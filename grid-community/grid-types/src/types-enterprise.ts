import type {
  FilterCombined,
  FilterDate,
  FilterFunction,
  FilterNumber,
  FilterRegistered,
  FilterText,
  RowNode,
} from "./types";

export interface CellSelectionRect {
  readonly rowStart: number;
  readonly rowEnd: number;
  readonly columnStart: number;
  readonly columnEnd: number;
}

export type CellSelectionMode = "single" | "range" | "multi-range" | "none";

// Column
export interface ColumnMenuItemLeaf<E> {
  readonly label: string;
  readonly disabled?: boolean | { reason: string };
  readonly startIconPadding?: boolean;
  readonly action: () => void;
  readonly icon?: () => E;
  readonly endElement?: () => E;
}

export interface ColumnMenuItemGroup<E> {
  readonly icon?: () => E;
  readonly label: string;
  readonly children: ColumnMenuItem<E>[];
  readonly disabled?: boolean | { reason: string };
}

export type ColumnMenuItem<E> = ColumnMenuItemLeaf<E> | ColumnMenuItemGroup<E> | "--";

// Context Menu

export type ContextMenuGridTargets =
  | "cell"
  | "header"
  | "header-group"
  | "header-floating"
  | (string & {});

export type ContextMenuItemParams<A> = {
  readonly api: A;
  readonly target: ContextMenuGridTargets;
  readonly columnIndex?: number | null;
  readonly rowIndex?: number | null;
};

export type ContextMenuItems<A, E> = (
  p: ContextMenuItemParams<A>,
) => (ColumnMenuItem<E> | null | undefined | false)[] | null;

// Clipboard
export interface ClipboardTransformCopyParams<A> {
  readonly api: A;
  readonly data: unknown[][];
  readonly rect: CellSelectionRect;
}
export interface ClipboardTransformPasteParams<A> {
  readonly api: A;
  readonly clipboard: ClipboardItems;
  readonly rect: CellSelectionRect;
}

export interface ClipboardTransformCellValueParams<A, D, C> {
  readonly api: A;
  readonly column: C;
  readonly row: RowNode<D>;
  readonly field: unknown;
}
export interface ClipboardTransformHeaderParams<A, C> {
  readonly api: A;
  readonly column: C;
  readonly header: string;
}
export interface ClipboardTransformHeaderGroupParams<A, C> {
  readonly api: A;
  readonly groupPath: string[];
  readonly group: string;
  readonly columnsInGroup: C[];
}

export type ClipboardTransformCellValue<A, D, C> = (
  p: ClipboardTransformCellValueParams<A, D, C>,
) => string;
export type ClipboardTransformHeader<A, C> = (p: ClipboardTransformHeaderParams<A, C>) => string;
export type ClipboardTransformHeaderGroup<A, C> = (
  p: ClipboardTransformHeaderGroupParams<A, C>,
) => string;
export type ClipboardTransformCopy<A> = (p: ClipboardTransformCopyParams<A>) => ClipboardItems;
export type ClipboardTransformPaste<A> = (
  p: ClipboardTransformPasteParams<A>,
) => unknown[][] | Promise<unknown[][]>;

export type ClipboardCopyOptions = {
  includeHeaders?: boolean;
  includeHeaderGroups?: boolean;
  uniformHeaderGroupCopy?: boolean;
};

export type FilterIn = {
  readonly isInternal?: boolean;
  readonly kind: "in";
  readonly operator: "in" | "notin";
  readonly columnId: string;
  readonly set: Set<unknown>;
};

export type ColumnFilter<A, D> =
  | FilterText
  | FilterNumber
  | FilterDate
  | FilterCombined<A, D>
  | FilterRegistered
  | FilterFunction<A, D>
  | FilterIn;

// floating Frame

export interface FloatingFrame<A, E> {
  readonly title: string;
  readonly component: (p: { api: A }) => E;
  readonly x?: number;
  readonly y?: number;
  readonly w?: number;
  readonly h?: number;
  readonly isMovable?: boolean;
  readonly isResizable?: boolean;
  readonly onFrameClose?: () => void;
}

export interface PanelFrame<A, E> {
  readonly title: string;
  readonly component: (p: { api: A }) => E;
  readonly w?: number;
  readonly isResizable?: boolean;
}

// Column Pivots

export interface ColumnPivotEventParams<A, C> {
  readonly api: A;
  readonly columns?: C[];
  readonly error?: unknown;
}
export type ColumnPivotEvent<A, C> = (p: ColumnPivotEventParams<A, C>) => void;

export interface ColumnMenuOpenChangeParams<A, C> {
  readonly api: A;
  readonly column: C | null;
}
export type ColumnFilterMenuOpenChangeParams<A, C> = ColumnMenuOpenChangeParams<A, C>;

export interface HandleRef {
  open(bb: { getBoundingClientRect(): DOMRect }): void;
  close(): void;
}

export interface PanelFrameHandle {
  open: (side: "start" | "end") => void;
  close: () => void;
}

export type Target = { getBoundingClientRect(): DOMRect };
