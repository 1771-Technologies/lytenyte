import { PlusIcon } from "../icons";
import type { SortRowItem } from "./sort-manager-container";

export function SortAdder({ item }: { item: SortRowItem }) {
  return (
    <button className="lng1771-sort-manager__button" onClick={item.onAdd} disabled={!item.canAdd}>
      <PlusIcon width={15} height={15} />
    </button>
  );
}
