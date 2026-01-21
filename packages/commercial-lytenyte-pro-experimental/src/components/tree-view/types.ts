import type { RowGroup, RowLeaf } from "@1771technologies/lytenyte-shared";

export interface TreeViewItem {
  readonly id: string;
  readonly path: string[];
  readonly name?: string;
}

export interface TreeViewChildParams<T extends TreeViewItem> {
  readonly row: RowGroup | RowLeaf<T>;
  readonly toggle: (b?: boolean) => void;

  readonly selected: boolean;
  readonly indeterminate: boolean;
  readonly selectEnabled: boolean;
  readonly select: (b?: boolean) => void;
  readonly handleSelect: (params: { readonly target: EventTarget; readonly shiftKey: boolean }) => void;
}

export interface TreeViewSelectAllParams {
  readonly selected: boolean;
  readonly indeterminate: boolean;
  readonly toggle: (b?: boolean) => void;
}
