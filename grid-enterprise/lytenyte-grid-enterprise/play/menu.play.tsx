import "@1771technologies/react-menu/css";
import {
  ControlledMenu,
  MenuDivider,
  MenuItem,
  SubMenu,
  useClick,
} from "@1771technologies/react-menu";
import { useRef, useState } from "react";
import { SortIcon } from "../src/components/icons/sort-icon";
import { FunnelIcon } from "../src/components/icons/funnel-icon";
import { AutosizeIcon } from "../src/components/icons/autosize-icon";
import { GroupByColumnIcon } from "../src/components/icons/group-by-column-icon";
import { ManageColumnsIcon } from "../src/components/icons/manage-columns-icon";
import { ResetColumnsIcon } from "../src/components/icons/reset-columns-icon";
import { HideColumnIcon } from "../src/components/icons/hide-column-icon";
import { AggregationIcon } from "../src/components/icons/aggregation-icon";
import { AscendingIcon } from "../src/components/icons/ascending-icon";
import { DescendingIcon } from "../src/components/icons/descending-icon";

export default function Home() {
  const ref = useRef<HTMLButtonElement | null>(null);
  const [isOpen, setIsOpen] = useState(true);
  const anchorProps = useClick(isOpen, setIsOpen);
  return (
    <div style={{ padding: 400 }}>
      <button ref={ref} {...anchorProps}>
        Open Menu
      </button>

      <ControlledMenu state={"open"} anchorRef={ref as any} onClose={() => setIsOpen(false)} arrow>
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
      </ControlledMenu>
    </div>
  );
}
