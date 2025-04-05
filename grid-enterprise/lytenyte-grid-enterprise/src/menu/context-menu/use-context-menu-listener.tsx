import { useEffect } from "react";
import { useGrid } from "../../use-grid";
import { getHoveredColumnIndex, getHoveredRowIndex } from "@1771technologies/grid-core";
import { getClientX, getClientY } from "@1771technologies/js-utils";
import type { ContextMenuGridTargets } from "@1771technologies/grid-types/pro";

export function useContextMenuListener(
  setMenu: (
    p: {
      hoveredRow: number | null;
      hoveredColumn: number | null;
      menuTarget: ContextMenuGridTargets;
    } | null,
  ) => void,
) {
  const grid = useGrid();

  const viewport = grid.state.internal.viewport.use();
  const menuRenderer = grid.state.contextMenuRenderer.use();

  const target = grid.state.internal.contextMenuTarget.use();
  useEffect(() => {
    if (!viewport || !menuRenderer) return;

    const controller = new AbortController();
    viewport.addEventListener(
      "contextmenu",
      (e) => {
        if (e.ctrlKey || e.metaKey) return;

        if (target) {
          e.preventDefault();
          e.stopPropagation();
          return;
        }

        const x = getClientX(e);
        const hoveredCell = getHoveredColumnIndex(grid.api, x);
        const y = getClientY(e);
        const hoveredRow = getHoveredRowIndex(grid.api, y);

        let menuTarget: ContextMenuGridTargets | null = hoveredRow != null ? "cell" : null;

        if (hoveredRow == null) {
          // lets determine the header section.
          let current = e.target as HTMLElement;
          while (
            current &&
            current.getAttribute("data-lng1771-kind") == null &&
            current !== viewport
          ) {
            current = current.parentElement as HTMLElement;
          }

          if (current && current !== viewport) {
            const kind = current.getAttribute("data-lng1771-kind");
            if (kind === "floating") menuTarget = "header-floating";
            if (kind === "header") menuTarget = "header";
            if (kind === "header-group") menuTarget = "header-group";
          }
        }

        if (!menuTarget || hoveredCell == null) {
          setMenu(null);
          return;
        }

        setMenu({
          menuTarget: menuTarget,
          hoveredRow: hoveredRow,
          hoveredColumn: hoveredCell,
        });

        e.stopPropagation();
        e.preventDefault();

        const cellSelectionMode = grid.state.cellSelectionMode.peek();
        if (
          menuTarget === "cell" &&
          cellSelectionMode !== "none" &&
          !grid.api.cellSelectionIsSelected(hoveredRow!, hoveredCell)
        ) {
          grid.state.cellSelections.set([
            {
              rowStart: hoveredRow!,
              rowEnd: hoveredRow! + 1,
              columnStart: hoveredCell,
              columnEnd: hoveredCell + 1,
            },
          ]);
        }

        grid.state.internal.contextMenuTarget.set({ x: x, y, width: 1, height: 1 });
      },
      { signal: controller.signal },
    );

    return () => controller.abort();
  }, [
    target,
    grid.api,
    grid.state.cellSelectionMode,
    grid.state.cellSelections,
    grid.state.internal.contextMenuTarget,
    menuRenderer,
    viewport,
    setMenu,
  ]);
}
