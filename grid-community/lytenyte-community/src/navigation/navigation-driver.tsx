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
        if (key === "ArrowUp") {
          api.navigateUp();
          handled = true;
        } else if (key === "ArrowDown") {
          api.navigateDown();
          handled = true;
        } else if (key === startDir) {
          api.navigatePrev();
          handled = true;
        } else if (key === endDir) {
          api.navigateNext();
          handled = true;
        }

        if (handled) {
          ev.preventDefault();
          ev.stopPropagation();
        }
      },
      { signal: controller.signal },
    );

    viewport.addEventListener(
      "focusout",
      (event) => {
        if (
          event.relatedTarget &&
          event.relatedTarget instanceof HTMLElement &&
          viewport.contains(event.relatedTarget) &&
          event.relatedTarget !== viewport
        ) {
          return;
        }
        // Focus has left our viewport
        api.getState().internal.navigatePosition.set(null);
      },
      { signal: controller.signal },
    );

    return () => controller.abort();
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
