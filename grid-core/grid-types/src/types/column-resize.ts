import type { ApiCore, ColumnCore } from "../export-core";
import type { ApiPro, ColumnPro } from "../export-pro";

export type ColumnResizeDragEvent<A, C> = (
  api: A,
  column: C,
  resize: { delta: number; newWidth: number },
) => void;

export type ColumnResizeDragEventCore<D, E> = ColumnResizeDragEvent<
  ApiCore<D, E>,
  ColumnCore<D, E>
>;

export type ColumnResizeDragEventPro<D, E> = ColumnResizeDragEvent<ApiPro<D, E>, ColumnPro<D, E>>;
