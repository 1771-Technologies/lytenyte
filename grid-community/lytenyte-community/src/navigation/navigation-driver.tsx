import { useEffect } from "react";
import { useGrid } from "../use-grid";

export function NavigationDriver() {
  const { state, api } = useGrid();

  const viewport = state.internal.viewport.use();
  const rtl = state.rtl.use();

  useEffect(() => {
    if (!viewport) return;

    const controller = new AbortController();

    viewport.addEventListener("keydown", (ev) => {
      const key = ev.key;

      const startDir = rtl ? "ArrowRight" : "ArrowLeft";
      const endDir = rtl ? "ArrowLeft" : "ArrowRight";

      const position = state.internal.navigatePosition.peek();
      const activeEdit = state.internal.cellEditActiveLocation.peek();
      if (!position || activeEdit) return;

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
    });

    return () => controller.abort();
  }, [api, rtl, state.internal.cellEditActiveLocation, state.internal.navigatePosition, viewport]);

  return <></>;
}
