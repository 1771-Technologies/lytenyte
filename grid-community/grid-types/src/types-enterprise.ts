import type { CSSProperties, ReactNode } from "react";
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

export type ColumnInFilterItemLeaf = {
  readonly kind: "leaf";
  readonly label: string;
  readonly value: unknown;
};

export type ColumnInFilterItemParent = {
  readonly kind: "parent";
  readonly label: string;
  readonly children: ColumnInFilterItem[];
};
export type ColumnInFilterItem = ColumnInFilterItemLeaf | ColumnInFilterItemParent;

export interface BaseMenuItem {
  readonly id: string;
  readonly label: string;

  readonly icon?: () => ReactNode;
  readonly disabled?: boolean;

  readonly className?: string;
  readonly style?: CSSProperties;

  readonly axe?: {
    readonly axeLabel: string;
    readonly axeDescription: string;
  };
}

export interface ColumnMenuItemLeaf<D = any> extends BaseMenuItem {
  readonly kind: "item";
  readonly action: (s: { state: D; item: ColumnMenuItemLeaf<D> }) => void;
  readonly endIcon?: () => ReactNode;
}

export interface ColumnMenuSeparator {
  readonly kind: "separator";
}
export interface ColumnMenuParent<D = any> extends BaseMenuItem {
  readonly kind: "submenu";
  readonly children: ColumnMenuItem<D>[];
  readonly menuClassName?: string;
  readonly menuStyle?: CSSProperties;

  readonly axe?: BaseMenuItem["axe"] & { axeMenuLabel?: string; axeMenuDescription?: string };
}

export type ColumnMenuItem<D = any> =
  | ColumnMenuParent<D>
  | ColumnMenuItemLeaf<D>
  | ColumnMenuSeparator;

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

export type ContextMenuItems<A, E> = (p: ContextMenuItemParams<A>) => ColumnMenuItem<E>[] | null;

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
  | FilterFunction<A, D>;

export type ColumnFilterModel<A, D> = {
  [columnId: string]: { simple: ColumnFilter<A, D>; in: FilterIn };
};

// Overlays
export type OverlayId =
  | "lng1771-loading-overlay"
  | "lng1771-no-data-overlay"
  | "lng1771-load-error-overlay"
  | (string & {});

export type OverlayRendererParams<A> = {
  readonly api: A;
};

export interface Overlay<A, E> {
  readonly renderer: (p: OverlayRendererParams<A>) => E;
  readonly overRows?: boolean;
}

export type Overlays<A, E> = {
  [id: string]: Overlay<A, E>;
};

// floating Frame

export interface FloatingFrame<A, E> {
  readonly title: string;
  readonly component: (p: { readonly api: A; frame: FloatingFrame<A, E> }) => E;
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
  readonly component: (p: { api: A; frame: PanelFrame<A, E> }) => E;
}

// Column Pivots

export interface ColumnPivotEventParams<A, C> {
  readonly api: A;
  readonly columns?: C[];
  readonly error?: unknown;
}
export type ColumnPivotEvent<A, C> = (p: ColumnPivotEventParams<A, C>) => void;

export type Target = HTMLElement | { x: number; y: number; width: number; height: number };
