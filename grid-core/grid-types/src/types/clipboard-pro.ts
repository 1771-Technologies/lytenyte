import type { ApiPro, ColumnPro } from "../export-pro";
import type { CellSelectionRect } from "./cell-selection-pro";
import type { RowNode } from "./row-nodes";

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

export type ClipboardCopyOptions<A, D, C> = {
  readonly includeHeaders?: boolean;
  readonly includeHeaderGroups?: boolean;
  readonly uniformHeaderGroupCopy?: boolean;

  readonly transformCellValue?: ClipboardTransformCellValue<A, D, C>;
  readonly transformHeader?: ClipboardTransformHeader<A, C>;
  readonly transformHeaderGroup?: ClipboardTransformHeaderGroup<A, C>;
  readonly transformCopy?: ClipboardTransformCopy<A>;
};

export type ClipboardPasteOptions<A> = {
  readonly transformPaste?: ClipboardTransformPaste<A>;
};

// Additional

export type ClipboardTransformCopyParamsPro<D, E> = ClipboardTransformCopyParams<ApiPro<D, E>>;
export type ClipboardTransformPasteParamsPro<D, E> = ClipboardTransformPasteParams<ApiPro<D, E>>;
export type ClipboardTransformCellValueParamsPro<D, E> = ClipboardTransformCellValueParams<
  ApiPro<D, E>,
  D,
  ColumnPro<D, E>
>;
export type ClipboardTransformHeaderParamsPro<D, E> = ClipboardTransformHeaderParams<
  ApiPro<D, E>,
  ColumnPro<D, E>
>;
export type ClipboardTransformHeaderGroupParamsPro<D, E> = ClipboardTransformHeaderGroupParams<
  ApiPro<D, E>,
  ColumnPro<D, E>
>;
export type ClipboardTransformCellValuePro<D, E> = ClipboardTransformCellValue<
  ApiPro<D, E>,
  D,
  ColumnPro<D, E>
>;
export type ClipboardTransformHeaderPro<D, E> = ClipboardTransformHeader<
  ApiPro<D, E>,
  ColumnPro<D, E>
>;
export type ClipboardTransformHeaderGroupPro<D, E> = ClipboardTransformHeaderGroup<
  ApiPro<D, E>,
  ColumnPro<D, E>
>;
export type ClipboardTransformCopyPro<D, E> = ClipboardTransformCopy<ApiPro<D, E>>;
export type ClipboardTransformPastePro<D, E> = ClipboardTransformPaste<ApiPro<D, E>>;
export type ClipboardCopyOptionsPro<D, E> = ClipboardCopyOptions<ApiPro<D, E>, D, ColumnPro<D, E>>;
export type ClipboardPasteOptionsPro<D, E> = ClipboardPasteOptions<ApiPro<D, E>>;
