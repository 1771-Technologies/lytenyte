export interface DragItems {
  [key: string]: string;
}

export interface SiteLocalDragData {
  [key: string]: any;
}

export interface DragData {
  siteLocalData?: SiteLocalDragData;
  dataTransfer?: DragItems;
}

export interface DragMoveState {
  readonly isKeyboard: boolean;
  readonly x: number;
  readonly y: number;
  readonly dropElement: HTMLElement;
  readonly dragElement: HTMLElement;
  readonly rect: DOMRect;
  readonly topHalf: boolean;
  readonly leftHalf: boolean;
}

export interface DropWrapState {
  readonly canDrop: boolean;
  readonly over: boolean;
}

export interface OnDropParams {
  state: DragData;
  moveState: DragMoveState;
  dragElement: HTMLElement;
  dropElement: HTMLElement;
}
export interface OnDragEvent {
  readonly state: DragData;
  readonly position: DragPosition;
  readonly dragElement: HTMLElement;
}

export interface DragPosition {
  readonly x: number;
  readonly y: number;
}

export interface DropZone {
  readonly enter: (el: HTMLElement) => void;
  readonly leave: (el: HTMLElement) => void;
  readonly drop: () => void;
}

export type InCurrent<T> = { current: T };
