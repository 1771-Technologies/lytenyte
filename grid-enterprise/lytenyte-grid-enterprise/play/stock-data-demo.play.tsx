import "@1771technologies/react-menu/css";
import { ColumnManagerFrame } from "@1771technologies/grid-components";
import { LyteNyteGrid, useClientDataSource, useLyteNyte } from "../src";
import { stockColumns } from "../stock-data/columns";
import { stockData } from "../stock-data/stocks";
import { MenuDivider, MenuItem, SubMenu } from "@1771technologies/react-menu";
import { AggregationIcon } from "../src/components/icons/aggregation-icon";
import { AscendingIcon } from "../src/components/icons/ascending-icon";
import { AutosizeIcon } from "../src/components/icons/autosize-icon";
import { DescendingIcon } from "../src/components/icons/descending-icon";
import { FunnelIcon } from "../src/components/icons/funnel-icon";
import { GroupByColumnIcon } from "../src/components/icons/group-by-column-icon";
import { HideColumnIcon } from "../src/components/icons/hide-column-icon";
import { ManageColumnsIcon } from "../src/components/icons/manage-columns-icon";
import { ResetColumnsIcon } from "../src/components/icons/reset-columns-icon";
import { SortIcon } from "../src/components/icons/sort-icon";

export default function StockDataDemo() {
  const ds = useClientDataSource({
    data: stockData,
  });
  const grid = useLyteNyte({
    gridId: "stock-demo",
    columnBase: {
      sortable: true,
      resizable: true,
      movable: true,
      columnMenuPredicate: true,
    },
    columns: stockColumns,
    rowDataSource: ds,
    columnMenuRenderer: MenuRenderer,
    panelFrameButtons: [
      { id: "column-manager", label: "Columns", icon: () => <ManageColumnsIcon /> },
    ],
    panelFrames: {
      "column-manager": { component: () => <ColumnManagerFrame />, title: "Columns" },
    },
  });

  return (
    <div
      className={css`
        flex: 1;
        display: flex;
        flex-direction: column;
        height: 100vh;
      `}
    >
      <LyteNyteGrid grid={grid} />
    </div>
  );
}

function MenuRenderer() {
  return (
    <>
      <SubMenu
        label={
          <>
            <SortIcon /> Sort
          </>
        }
      >
        <MenuItem>
          <AscendingIcon /> Ascending
        </MenuItem>
        <MenuItem>
          <DescendingIcon /> Descending
        </MenuItem>
      </SubMenu>

      <MenuItem>
        <FunnelIcon /> Filter
      </MenuItem>

      <MenuItem>
        <AutosizeIcon /> Autosize
      </MenuItem>
      <MenuItem>
        <GroupByColumnIcon /> Group By Column
      </MenuItem>
      <MenuItem>
        <ManageColumnsIcon /> Manage Columns
      </MenuItem>
      <MenuItem>
        <ResetColumnsIcon /> Reset Columns
      </MenuItem>
      <MenuItem>
        <HideColumnIcon /> Hide Column
      </MenuItem>
      <MenuDivider />
      <SubMenu
        label={
          <>
            <AggregationIcon /> Aggregation Select
          </>
        }
      >
        <MenuItem type="checkbox" checked>
          Avg
        </MenuItem>
        <MenuItem type="checkbox">Sum</MenuItem>
        <MenuItem type="checkbox">Min</MenuItem>
        <MenuItem type="checkbox">Max</MenuItem>
        <MenuItem type="checkbox">First</MenuItem>
        <MenuItem type="checkbox">Last</MenuItem>
      </SubMenu>
    </>
  );
}
