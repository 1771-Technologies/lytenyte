import type { ColumnEnterpriseReact } from "@1771technologies/grid-types";
import { useGrid } from "../provider/grid-provider";
import type { Target } from "@1771technologies/grid-types/enterprise";
import { LngPopover } from "../popover/lng-popover";
import { clsx } from "@1771technologies/js-utils";
import { PopoverMenu } from "../popover-menu/popover-menu";
import { useMemo } from "react";
import type { MenuItem } from "@1771technologies/react-menu";

export const ColumnMenuDriver = () => {
  const grid = useGrid();
  const menuColumn = grid.state.internal.columnMenuColumn.use();
  const target = grid.state.internal.columnMenuTarget.use();

  if (!menuColumn || !target) return;

  return <ColumnMenuDriverImpl menuColumn={menuColumn} target={target} />;
};

function ColumnMenuDriverImpl({
  menuColumn,
  target,
}: {
  menuColumn: ColumnEnterpriseReact<any>;
  target: Target;
}) {
  const grid = useGrid();
  const base = grid.state.columnBase.use();

  const menuState = grid.state.columnMenuState.use();
  const getMenuItems = menuColumn.columnMenuGetItems ?? base.columnMenuGetItems;

  const menuItems = useMemo<MenuItem[]>(() => {
    if (!getMenuItems) return [];

    return getMenuItems(grid.api);
  }, [getMenuItems, grid.api]);

  return (
    <>
      {!getMenuItems && (
        <LngPopover open onOpenChange={() => grid.api.columnMenuClose()} popoverTarget={target}>
          <div
            className={clsx(
              "lng1771-text-medium",

              css`
                width: 200px;
                height: 50px;
                display: flex;
                text-align: center;
                align-items: center;
                justify-content: center;
              `,
            )}
          >
            This column does not have a menu
          </div>
        </LngPopover>
      )}
      {getMenuItems && (
        <PopoverMenu
          menuItems={menuItems}
          state={menuState}
          onOpenChange={() => grid.api.columnMenuClose()}
          open
          placement="bottom"
          popoverTarget={target}
          rtl={grid.state.rtl.use()}
        ></PopoverMenu>
      )}
    </>
  );
}
