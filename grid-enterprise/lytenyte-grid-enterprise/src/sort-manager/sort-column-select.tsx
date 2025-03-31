import { Select } from "../select/select.js";
import type { SortRowItem } from "./sort-manager-container.js";

export const SortColumnSelect = ({
  item,
  placeholder = "Sort by",
}: {
  item: SortRowItem;
  placeholder?: string;
}) => {
  return (
    <Select
      placeholder={placeholder}
      selected={item.columnSelected}
      onSelect={item.columnOnSelect}
      options={item.columnOptions}
    />
  );
};
