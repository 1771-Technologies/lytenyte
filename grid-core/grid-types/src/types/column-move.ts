import type { ApiCore } from "../export-core";
import type { ApiPro } from "../export-pro";

export type ColumnMoveDragEvent<A> = (
  event: DragEvent,
  api: A,
  columns: string[],
  over: string | null,
) => void;

export type ColumnMoveDragEventCore<D, E> = ColumnMoveDragEvent<ApiCore<D, E>>;
export type ColumnMoveDragEventPro<D, E> = ColumnMoveDragEvent<ApiPro<D, E>>;
