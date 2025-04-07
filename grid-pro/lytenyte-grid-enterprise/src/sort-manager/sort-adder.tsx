import { PlusIcon } from "../icons.js";
import type { SortRowItem } from "./sort-manager-container.js";

export function SortAdder({ item }: { item: SortRowItem }) {
  return (
    <button className="lng1771-sort-manager__button" onClick={item.onAdd} disabled={!item.canAdd}>
      <PlusIcon width={15} height={15} />
    </button>
  );
}
