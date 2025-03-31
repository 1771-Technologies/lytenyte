import { Select } from "../select/select";
import type { SortRowItem } from "./sort-manager-container";

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
