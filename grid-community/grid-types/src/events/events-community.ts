import type { PropsCommunity } from "../props/props-community";
import type {
  CellEditBeginEvent,
  CellEditEndEvent,
  CellEditEvent,
  ColumnMoveDragEvent,
  ColumnResizeDragEvent,
  RowDragEvent,
  RowSelectionEvent,
} from "../types";

export type LngEvent<A> = (api: A) => void;

export type PropEvents<A> = {
  [key in keyof Required<
    PropsCommunity<any, any, any, any, any, any>
  > as `on${Capitalize<key>}Change`]: LngEvent<A>;
};

export interface EventsCommunity<A, D, C> extends PropEvents<A> {
  readonly onCellEditBegin: CellEditBeginEvent<A>;
  readonly onCellEditValueChange: CellEditEvent<A>;
  readonly onCellEditSuccess: CellEditEvent<A>;
  readonly onCellEditFailure: CellEditEvent<A>;
  readonly onCellEditCancel: CellEditEndEvent<A>;
  readonly onCellEditEnd: CellEditEndEvent<A>;

  readonly onColumnMove: LngEvent<A>;

  readonly onColumnMoveDragStart: ColumnMoveDragEvent<A>;
  readonly onColumnMoveDragMove: ColumnMoveDragEvent<A>;
  readonly onColumnMoveDragCancel: ColumnMoveDragEvent<A>;
  readonly onColumnMoveDragEnd: ColumnMoveDragEvent<A>;

  readonly onColumnResize: LngEvent<A>;
  readonly onColumnResizeDragStart: ColumnResizeDragEvent<A, C>;
  readonly onColumnResizeDragMove: ColumnResizeDragEvent<A, C>;
  readonly onColumnResizeDragCancel: ColumnResizeDragEvent<A, C>;
  readonly onColumnResizeDragEnd: ColumnResizeDragEvent<A, C>;

  readonly onKey: LngEvent<A>;

  readonly onNavigateChange: LngEvent<A>;

  readonly onNavigateNext: LngEvent<A>;
  readonly onNavigatePrev: LngEvent<A>;
  readonly onNavigateUp: LngEvent<A>;
  readonly onNavigateDown: LngEvent<A>;

  readonly onNavigateToStart: LngEvent<A>;
  readonly onNavigateToEnd: LngEvent<A>;
  readonly onNavigateToTop: LngEvent<A>;
  readonly onNavigateToBottom: LngEvent<A>;

  readonly onNavigatePageDown: LngEvent<A>;
  readonly onNavigatePageUp: LngEvent<A>;

  readonly onRowDragStart: RowDragEvent<A, D>;
  readonly onRowDragMove: RowDragEvent<A, D>;
  readonly onRowDragCancel: RowDragEvent<A, D>;
  readonly onRowDragEnd: RowDragEvent<A, D>;
  readonly onRowDragDrop: RowDragEvent<A, D>;

  readonly onRowExpansionChange: (api: A, rowId: string) => void;

  readonly onRowSelectionSelected: RowSelectionEvent<A, D>;
  readonly onRowSelectionDeselected: RowSelectionEvent<A, D>;
  readonly onRowSelectionAllSelected: LngEvent<A>;
  readonly onRowSelectionClear: LngEvent<A>;

  readonly onRowRefresh: LngEvent<A>;
}

type LngEventNames = keyof EventsCommunity<any, any, any>;

export type LngAddEventListenerCommunity<A, D, C> = <K extends LngEventNames>(
  eventName: K,
  callback: EventsCommunity<A, D, C>[K],
) => () => void;

export type LngRemoveEventListenerCommunity<A, D, C> = <K extends LngEventNames>(
  eventName: K,
  callback: EventsCommunity<A, D, C>[K],
) => void;
