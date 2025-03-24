import { createContext, useContext, useRef, type PropsWithChildren } from "react";
import { create, useStore } from "zustand";

export interface Droppable {
  readonly id: string;
  readonly accepted: string[];
  readonly target: HTMLElement;
  readonly data: any;
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

const store = create<DragStore>()(() => {
  return {
    active: null,
    mounted: [],
  };
});

const DragContext = createContext(store);

export function DragProvider({ children }: PropsWithChildren) {
  const localStore = useRef<typeof store>(null as unknown as typeof store);
  if (!localStore.current) {
    localStore.current = create<DragStore>()(() => {
      return {
        active: null,
        mounted: [],
      };
    });
  }

  return <DragContext.Provider value={localStore.current}>{children}</DragContext.Provider>;
}

export const useDragStore = () => useContext(DragContext);

export const useDrag = useStore;
