import { Select } from "../select/select";
import type { SortRowItem } from "./sort-manager-container";

export const SortColumnSelect = ({ item }: { item: SortRowItem }) => {
  return (
    <Select
      selected={item.columnSelected}
      onSelect={item.columnOnSelect}
      options={item.columnOptions}
    />
  );
};
