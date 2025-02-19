import "@1771technologies/react-menu/css";
import {
  ControlledMenu,
  MenuDivider,
  MenuItem,
  SubMenu,
  useClick,
} from "@1771technologies/react-menu";
import { useRef, useState } from "react";
import {
  AggregationIcon,
  AscendingIcon,
  AutosizeIcon,
  DescendingIcon,
  FunnelIcon,
  GroupByColumnIcon,
  HideColumnIcon,
  ManageColumnsIcon,
  ResetColumnsIcon,
  SortIcon,
} from "@1771technologies/lytenyte-grid-community/icons";
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
