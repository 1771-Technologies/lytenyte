import "./header.css";

import { clsx } from "@1771technologies/js-utils";
import { useGrid } from "../use-grid";
import { useHeaderDisplayGridTemplate } from "./use-header-display-grid-template";
import { t } from "@1771technologies/grid-design";
import { useHeaderCells } from "./use-header-cells";
import { useHeaderGroupCells } from "./use-header-group-cells";
import { useHeaderDividers } from "./header-divider/use-header-dividers";
import type { CSSProperties } from "react";
import { useFloatingCells } from "./use-floating-cells";

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
  const headerHeight = state.internal.viewportHeaderHeight.use();

  return (
    <div
      role="row"
      className={clsx(css`
        display: grid;
        block-size: fit-content;
        box-sizing: border-box;
        grid-template-columns: 0px;
        user-select: none;
        background-color: ${t.colors.backgrounds_ui_panel};
        position: relative;

        border-bottom: 1px solid ${t.colors.borders_default};
      `)}
      style={
        {
          gridTemplateRows,
          "--lng1771-header-height": `${headerHeight - (floatingRowEnabled ? floatingRowHeight : 0)}px`,
        } as CSSProperties
      }
    >
      {headerGroupCells}
      {headerCells}
      {headerDividers}
      {floatingCells}
    </div>
  );
}
