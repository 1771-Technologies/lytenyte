import { useEffect } from "react";
import { useGrid } from "../use-grid";
import { handleBeginCellEditFromEvent } from "./handle-begin-cell-edit";

export function CellEditDriver() {
  const { state, api } = useGrid();

  const viewport = state.internal.viewport.use();
  const cellEditActivator = state.cellEditPointerActivator.use();

  useEffect(() => {
    if (!viewport) return;

    const controller = new AbortController();
    const signal = controller.signal;

    if (cellEditActivator === "single-click") {
      viewport.addEventListener("pointerdown", (ev) => handleBeginCellEditFromEvent(api, ev), {
        signal,
      });
    }

    if (cellEditActivator === "double-click") {
      viewport.addEventListener(
        "dblclick",
        (ev) => {
          if (state.internal.cellEditActiveEdits.peek().size > 0) return;
          handleBeginCellEditFromEvent(api, ev);
        },
        { signal },
      );
    }

    return () => controller.abort();
  }, [
    api,
    cellEditActivator,
    state.columnsVisible,
    state.internal.cellEditActiveEdits,
    state.internal.cellEditActiveLocation,
    viewport,
  ]);

  return <></>;
}
