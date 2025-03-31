import { Select } from "../select/select";
import type { SortRowItem } from "./sort-manager-container";

export const SortDirectionSelection = ({ item }: { item: SortRowItem }) => {
  return (
    <Select
      selected={item.sortDirectionSelected}
      onSelect={item.sortDirectionOnSelect}
      options={item.sortDirectionOptions}
    />
  );
};
