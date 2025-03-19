import type { ColumnEnterpriseReact } from "@1771technologies/grid-types";
import { useGrid } from "../use-grid";
import type { Target } from "@1771technologies/grid-types/enterprise";
import { FilterContainer } from "../components/filters/filter-container/filter-container";
import { ControlledMenu } from "@1771technologies/react-menu";

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
    <ControlledMenu
      state="open"
      onClose={() => {
        const current = target;
        setTimeout(() => {
          if (current instanceof HTMLElement) current.focus();
        }, 20);

        grid.api.columnFilterMenuClose();
      }}
      anchorRef={target instanceof HTMLElement ? { current: target } : undefined}
      anchorPoint={!(target instanceof HTMLElement) ? target : undefined}
      gap={12}
    >
      <div style={{ width: 320 }}>
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
    </ControlledMenu>
  );
}
