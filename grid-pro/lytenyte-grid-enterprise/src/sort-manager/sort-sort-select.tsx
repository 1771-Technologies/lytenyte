import { Select } from "../select/select.js";
import type { SortRowItem } from "./sort-manager-container.js";

export const SortSelect = ({
  item,
  placeholder = "Select",
}: {
  item: SortRowItem;
  placeholder?: string;
}) => {
  return (
    <Select
      selected={item.sortSelected}
      onSelect={item.sortOnSelect}
      options={item.sortOptions}
      placeholder={placeholder}
    />
  );
};
