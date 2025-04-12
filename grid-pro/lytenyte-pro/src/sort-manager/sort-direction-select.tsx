import { Select, type SelectClassNames } from "../select/select.js";
import type { SortRowItem } from "./sort-manager-container.js";

export const SortDirectionSelection = ({
  item,
  placeholder,
  ...props
}: {
  item: SortRowItem;
  placeholder?: string;
} & SelectClassNames) => {
  return (
    <Select
      selected={item.sortDirectionSelected}
      onSelect={item.sortDirectionOnSelect}
      options={item.sortDirectionOptions}
      placeholder={placeholder}
      {...props}
    />
  );
};
