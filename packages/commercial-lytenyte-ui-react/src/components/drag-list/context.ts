import { createContext, useContext } from "react";

export interface DragListContextProps<T extends { id: string }> {
  readonly items: T[];
  readonly onItemsChange: (next: T[], prev: T[]) => void;
  readonly orientation: "vertical" | "horizontal";
}

const DragListContext = createContext<DragListContextProps<any>>({
  items: [],
  onItemsChange: () => {},
  orientation: "horizontal",
});
export const DragListProvider = DragListContext.Provider;
export const useDragList = () => useContext(DragListContext);
