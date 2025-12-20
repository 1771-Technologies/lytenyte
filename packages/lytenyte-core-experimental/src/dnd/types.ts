import type { ReactNode } from "react";

export type DragItemTransfer = {
  readonly kind: "dt";
  readonly type:
    | "text/plain"
    | "text/html"
    | "text/uri-list"
    | "application/json"
    | "text/csv"
    | "text/rtf"
    | ({} & string);
  readonly data: string;
};

export type DragItemSiteLocal = {
  readonly kind: "site";
  readonly data: unknown;
};

export type DragItem = DragItemTransfer | DragItemSiteLocal;
export type ReactPlaceholderFn = (p: { x: number; y: number; data: UseDraggableProps["data"] }) => ReactNode;

export interface DragEventParams {
  readonly ev: DragEvent;
  readonly data: UseDraggableProps["data"] | null;
}

export interface UseDraggableProps {
  readonly data: { [tag: string]: DragItem };
  readonly onDragStart?: (ev: DragEventParams) => void;
  readonly onDragMove?: (ev: DragEventParams) => void;
  readonly onDragEnd?: (ev: DragEventParams) => void;
  readonly onDrop?: (ev: DragEventParams) => void;
  readonly placeholder?: { query: string; offset?: [number, number] } | string | null | ReactPlaceholderFn;
}

export interface DropEventParams {
  readonly ev: DragEvent;
  readonly element: HTMLElement;
  readonly data: UseDraggableProps["data"] | null;
  readonly canDrop: boolean;
}

export interface UseDroppableProps {
  readonly accepted: string[];
  readonly moveEffect?: "move" | "link" | "copy" | "none";
  readonly active?: boolean;
  readonly onExit?: (p: DropEventParams) => void;
  readonly onEnter?: (p: DropEventParams) => void;
  readonly onDrop?: (p: DropEventParams) => void;
}
