import { Select, type SelectClassNames } from "../select/select.js";
import type { SortRowItem } from "./sort-manager-container.js";

export const SortColumnSelect = ({
  item,
  placeholder = "Sort by",
  ...props
}: {
  item: SortRowItem;
  placeholder?: string;
} & SelectClassNames) => {
  return (
    <Select
      placeholder={placeholder}
      selected={item.columnSelected}
      onSelect={item.columnOnSelect}
      options={item.columnOptions}
      {...props}
    />
  );
};
