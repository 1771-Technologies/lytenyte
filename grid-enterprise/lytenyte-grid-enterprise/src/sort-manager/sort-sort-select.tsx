import { Select } from "../select/select";
import type { SortRowItem } from "./sort-manager-container";

export const SortSelect = ({ item }: { item: SortRowItem }) => {
  return (
    <Select selected={item.sortSelected} onSelect={item.sortOnSelect} options={item.sortOptions} />
  );
};
