import { Select } from "../select/select.js";
import type { SortRowItem } from "./sort-manager-container.js";

export const SortDirectionSelection = ({
  item,
  placeholder,
}: {
  item: SortRowItem;
  placeholder?: string;
}) => {
  return (
    <Select
      selected={item.sortDirectionSelected}
      onSelect={item.sortDirectionOnSelect}
      options={item.sortDirectionOptions}
      placeholder={placeholder}
    />
  );
};
