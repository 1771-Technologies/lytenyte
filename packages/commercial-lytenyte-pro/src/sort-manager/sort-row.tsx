import { forwardRef, type JSX } from "react";
import { Item } from "../listbox/item";
import type { SortRowItem } from "./hooks/use-sort-row-item";
import { rowContext } from "./context";

export interface SortRowProps {
  readonly row: SortRowItem;
}

export const SortRow = forwardRef<HTMLDivElement, JSX.IntrinsicElements["div"] & SortRowProps>(
  function SortRow({ row, ...props }, forwarded) {
    return (
      <rowContext.Provider value={row}>
        <Item {...props} ref={forwarded} />
      </rowContext.Provider>
    );
  },
);
