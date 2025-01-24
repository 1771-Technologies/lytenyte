import { useEffect } from "react";
import { useGrid } from "../use-grid";
import { HEADER_CELL_POSITION } from "@1771technologies/grid-constants";

export function NavigationDriver() {
  const { state, api } = useGrid();

  const viewport = state.internal.viewport.use();
  const rtl = state.rtl.use();

  useEffect(() => {
    if (!viewport) return;

    const controller = new AbortController();

    viewport.addEventListener(
      "keydown",
      (ev) => {
        const key = ev.key;

        const startDir = rtl ? "ArrowRight" : "ArrowLeft";
        const endDir = rtl ? "ArrowLeft" : "ArrowRight";

        const position = state.internal.navigatePosition.peek();
        const activeEdit = state.internal.cellEditActiveLocation.peek();
        if (activeEdit) return;

        if (document.activeElement === viewport && (key === "ArrowDown" || key === endDir)) {
          if (state.columnsVisible.peek().length) {
            state.internal.navigatePosition.set({ kind: HEADER_CELL_POSITION, columnIndex: 0 });
          }

          ev.preventDefault();
          ev.stopPropagation();
        }

        if (!position) return;

        let handled = false;
        const meta = ev.ctrlKey || ev.metaKey;
        if (key === "PageUp") {
          api.navigatePageUp();
          handled = true;
        } else if (key === "PageDown") {
          api.navigatePageDown();
          handled = true;
        } else if (key === "Home") {
          api.navigateToTop();
          handled = true;
        } else if (key === "End") {
          api.navigateToBottom();
          handled = true;
        } else if (key === "ArrowUp") {
          if (meta) {
            api.navigateToTop();
          } else {
            api.navigateUp();
          }
          handled = true;
        } else if (key === "ArrowDown") {
          if (meta) {
            api.navigateToBottom();
          } else {
            api.navigateDown();
          }
          handled = true;
        } else if (key === startDir) {
          if (meta) {
            api.navigateToStart();
          } else {
            api.navigatePrev();
          }
          handled = true;
        } else if (key === endDir) {
          if (meta) {
            api.navigateToEnd();
          } else {
            api.navigateNext();
          }
          handled = true;
        }

        if (handled) {
          ev.preventDefault();
          ev.stopPropagation();
        }
      },
      { signal: controller.signal },
    );

    // Ensure the cell is always visible
    const unsub = state.internal.navigatePosition.watch(() => {
      const position = state.internal.navigatePosition.peek();
      if (!position) return;

      const rowIndex = "rowIndex" in position ? position.rowIndex : null;
      const columnIndex = position.columnIndex;

      api.navigateScrollIntoView(rowIndex, columnIndex);
    });

    viewport.addEventListener(
      "focusout",
      () => {
        setTimeout(() => {
          if (viewport.contains(document.activeElement)) {
            return;
          }

          console.log("iran");
          // Focus has left our viewport
          api.getState().internal.navigatePosition.set(null);
        }, 100);
      },
      { signal: controller.signal },
    );

    return () => {
      controller.abort();
      unsub();
    };
  }, [
    api,
    rtl,
    state.columnsVisible,
    state.internal.cellEditActiveLocation,
    state.internal.navigatePosition,
    viewport,
  ]);

  return <></>;
}
