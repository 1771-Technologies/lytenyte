import { CrossIcon } from "../icons";
import type { SortRowItem } from "./sort-manager-container";

export function SortRemover({ item }: { item: SortRowItem }) {
  return (
    <button className="lng1771-sort-manager__button" onClick={item.onDelete}>
      <CrossIcon width={16} height={16} />
    </button>
  );
}
