import type { ApiEnterpriseReact, ColumnEnterpriseReact } from "@1771technologies/grid-types";
import { FilterDashesIcon, GridButton } from "@1771technologies/lytenyte-grid-community/internal";
import { iconCls } from "../header-cell-default";
import { clsx } from "@1771technologies/js-utils";

interface FilterButtonProps {
  readonly api: ApiEnterpriseReact<any>;
  readonly column: ColumnEnterpriseReact<any>;
}

export function FilterButton({ api, column }: FilterButtonProps) {
  const s = api.getState().internal.filterMenuColumn.use();

  const isFiltering = s === column;
  return (
    <GridButton
      tabIndex={-1}
      className={clsx(
        iconCls,
        isFiltering &&
          css`
            opacity: 1 !important;
          `,
      )}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        api.columnFilterMenuOpen(column, e.currentTarget);
      }}
    >
      <FilterDashesIcon width={16} height={16} />
    </GridButton>
  );
}
