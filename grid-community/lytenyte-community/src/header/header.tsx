import "./header.css";

import { useGrid } from "../use-grid";
import { useHeaderDisplayGridTemplate } from "./use-header-display-grid-template";
import { useHeaderCells } from "./header-cell/use-header-cells";
import { useMemo, type CSSProperties } from "react";
import { useHeaderGroupCells } from "./header-group/use-header-group-cells";
import { useFloatingCells } from "./header-floating/use-floating-cells";
import { useHeaderDividers } from "../header-divider/use-header-dividers";

export function Header() {
  const { state, api } = useGrid();

  const columnHeaderHeight = state.columnHeaderHeight.use();
  const columnGroupHeaderHeight = state.columnGroupHeaderHeight.use();
  const floatingRowHeight = state.floatingRowHeight.use();
  const floatingRowEnabled = state.floatingRowEnabled.use();

  const hierarchy = state.columnGroupLevels.use();

  const headerGroupCells = useHeaderGroupCells(api);
  const headerCells = useHeaderCells(api);
  const headerDividers = useHeaderDividers(api);
  const floatingCells = useFloatingCells(api, floatingRowEnabled);

  const gridTemplateRows = useHeaderDisplayGridTemplate(
    hierarchy.length,
    columnHeaderHeight,
    columnGroupHeaderHeight,
    floatingRowEnabled,
    floatingRowHeight,
  );
  const headerHeightSetting = state.internal.viewportHeaderHeight.use();

  const headerHeight = useMemo(() => {
    return `${headerHeightSetting - (floatingRowEnabled ? floatingRowHeight : 0)}px`;
  }, [floatingRowEnabled, floatingRowHeight, headerHeightSetting]);

  return (
    <div
      role="row"
      className={"lng1771-header"}
      style={{ gridTemplateRows, "--lng1771-header-height": headerHeight } as CSSProperties}
    >
      {headerGroupCells}
      {headerCells}
      {headerDividers}
      {floatingCells}
    </div>
  );
}
