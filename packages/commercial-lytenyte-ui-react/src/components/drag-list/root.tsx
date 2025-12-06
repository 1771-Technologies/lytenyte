import { useMemo, type PropsWithChildren } from "react";
import type { DragListContextProps } from "./context.js";
import { DragListProvider } from "./context.js";

export function DragListRoot<T extends { id: string }>({
  items,
  onItemsChange,
  orientation = "horizontal",
  children,
}: PropsWithChildren<DragListRoot.Props<T>>) {
  const value = useMemo<DragListContextProps<T>>(() => {
    return { items, onItemsChange, orientation };
  }, [items, onItemsChange, orientation]);
  return <DragListProvider value={value}>{children}</DragListProvider>;
}

export namespace DragListRoot {
  export interface Props<T extends { id: string }> {
    readonly items: T[];
    readonly onItemsChange: (next: T[], prev: T[]) => void;
    readonly orientation?: "vertical" | "horizontal";
  }
}
