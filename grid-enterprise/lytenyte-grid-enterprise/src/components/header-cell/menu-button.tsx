import type { ApiEnterpriseReact, ColumnEnterpriseReact } from "@1771technologies/grid-types";
import { GridButton, MoreDotsVertical } from "@1771technologies/lytenyte-grid-community/internal";
import { iconCls } from "../header-cell-default";

export interface ColumnMenuProps {
  readonly api: ApiEnterpriseReact<any>;
  readonly column: ColumnEnterpriseReact<any>;
}

export function ColumnMenu({ api, column }: ColumnMenuProps) {
  return (
    <>
      <GridButton
        tabIndex={-1}
        className={iconCls}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();

          api.columnMenuOpen(column, e.currentTarget);
        }}
      >
        <MoreDotsVertical width={16} height={16} />
      </GridButton>
    </>
  );
}
