import { Select, type SelectClassNames } from "../select/select.js";
import type { SortRowItem } from "./sort-manager-container.js";

export const SortSelect = ({
  item,
  placeholder = "Select",
  ...props
}: {
  item: SortRowItem;
  placeholder?: string;
} & SelectClassNames) => {
  return (
    <Select
      selected={item.sortSelected}
      onSelect={item.sortOnSelect}
      options={item.sortOptions}
      placeholder={placeholder}
      {...props}
    />
  );
};
