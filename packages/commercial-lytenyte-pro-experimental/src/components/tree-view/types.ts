import type { RowGroup, RowLeaf } from "@1771technologies/lytenyte-shared";
import type { DragEvent } from "react";

export interface TreeViewItem {
  readonly id: string;
  readonly path: string[];
  readonly name?: string;
}

export interface TreeViewChildParams<T extends TreeViewItem> {
  readonly row: RowGroup | RowLeaf<T>;
  readonly leafs: () => T[];
  readonly toggle: (b?: boolean) => void;

  readonly selected: boolean;
  readonly indeterminate: boolean;
  readonly selectEnabled: boolean;
  readonly select: (b?: boolean) => void;
  readonly handleSelect: (params: { readonly target: EventTarget; readonly shiftKey: boolean }) => void;

  readonly dragProps: { draggable?: boolean; onDragStart?: (ev: DragEvent) => void };
  readonly isOver: boolean;
  readonly isBefore: boolean;
}

export interface TreeViewSelectAllParams {
  readonly selected: boolean;
  readonly indeterminate: boolean;
  readonly toggle: (b?: boolean) => void;
}
