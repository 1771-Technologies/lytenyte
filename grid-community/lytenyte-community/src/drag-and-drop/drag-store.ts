import { create } from "zustand";

export interface Droppable {
  readonly id: string;
  readonly accepted: string[];
  readonly target: HTMLElement;
}

export interface DropTarget extends Droppable {
  readonly canDrop: boolean;
  readonly box: DOMRect;
  readonly yHalf: "top" | "bottom";
  readonly xHalf: "left" | "right";
}

export interface DragActive {
  id: string;
  tags: string[];
  over: DropTarget[];
  data: unknown;
  x: number;
  y: number;
}

export interface DragStore {
  active: DragActive | null;
  mounted: Droppable[];
}

export const store = create<DragStore>()(() => {
  return {
    active: null,
    mounted: [],
  };
});
