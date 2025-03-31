import { Select } from "../select/select";
import type { SortRowItem } from "./sort-manager-container";

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
