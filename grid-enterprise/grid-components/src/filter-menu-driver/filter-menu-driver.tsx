import { useGrid } from "../provider/grid-provider";
import type { Target } from "@1771technologies/grid-types/enterprise";
import { LngPopover } from "../popover/lng-popover";
import type { ColumnEnterpriseReact } from "@1771technologies/grid-types";
import { FilterContainer } from "../filters/filter-container/filter-container";

export const FilterMenuDriver = () => {
  const grid = useGrid();
  const filterColumn = grid.state.internal.filterMenuColumn.use();
  const target = grid.state.internal.filterMenuTarget.use();

  if (!filterColumn || !target) return;

  return <FilterMenuImpl filterColumn={filterColumn} target={target} />;
};

function FilterMenuImpl({
  filterColumn,
  target,
}: {
  filterColumn: ColumnEnterpriseReact<any>;
  target: Target;
}) {
  const grid = useGrid();
  const base = grid.state.columnBase.use();

  const supportsIn = filterColumn.filterSupportsIn ?? base.filterSupportsIn ?? false;

  return (
    <LngPopover open onOpenChange={() => grid.api.columnFilterMenuClose()} popoverTarget={target}>
      <div
        className={css`
          width: 320px;
        `}
      >
        <FilterContainer
          api={grid.api}
          column={filterColumn}
          getTreeFilterItems={(_, column) => grid.api.columnInFilterItems(column)}
          onApplyFilters={() => grid.api.columnFilterMenuClose()}
          onCancel={() => grid.api.columnFilterMenuClose()}
          onClearFilters={() => grid.api.columnFilterMenuClose()}
          showInFilter={supportsIn}
          showSimpleFilters
          treeViewportHeight={250}
        />
      </div>
    </LngPopover>
  );
}
