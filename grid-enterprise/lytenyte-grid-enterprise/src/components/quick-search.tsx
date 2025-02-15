import type { StoreEnterpriseReact } from "@1771technologies/grid-types";
import { Input } from "@1771technologies/lytenyte-grid-community/internal";
import { SearchIcon } from "./icons/search-icon";

export interface QuickSearchInputProps<D> {
  readonly grid: StoreEnterpriseReact<D>;
}

export function QuickSearchInput<D>({ grid }: QuickSearchInputProps<D>) {
  const quickSearchValue = grid.state.filterQuickSearch.use() ?? "";

  return (
    <Input
      icon={SearchIcon}
      small
      placeholder="Search..."
      value={quickSearchValue}
      onChange={(c) => {
        grid.state.filterQuickSearch.set(c.target.value || null);
      }}
    />
  );
}
