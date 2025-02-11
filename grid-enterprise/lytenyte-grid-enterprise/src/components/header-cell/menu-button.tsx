import type { ApiEnterpriseReact, ColumnEnterpriseReact } from "@1771technologies/grid-types";
import { GridButton, MoreDotsVertical } from "@1771technologies/lytenyte-grid-community/internal";
import { iconCls } from "./header-cell-default";
import { clsx } from "@1771technologies/js-utils";

export interface ColumnMenuProps {
  readonly api: ApiEnterpriseReact<any>;
  readonly column: ColumnEnterpriseReact<any>;
}

export function ColumnMenu({ api, column }: ColumnMenuProps) {
  const s = api.getState().internal.columnMenuColumn.use();
  const isOpen = s === column;
  return (
    <>
      <GridButton
        tabIndex={-1}
        className={clsx(
          iconCls,
          isOpen &&
            css`
              opacity: 1 !important;
            `,
        )}
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
