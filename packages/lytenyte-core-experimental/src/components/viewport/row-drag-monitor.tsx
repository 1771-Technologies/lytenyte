import { useEffect, useMemo, useRef } from "react";
import { clearDragGlobals, dragData, dragX, dragY } from "../../dnd/global.js";
import { useRoot } from "../../root/root-context.js";
import { useSelector } from "../../signal/signal.js";
import { getNearestRow, getRowIndexFromEl, type RowNode } from "@1771technologies/lytenyte-shared";
import type { Root } from "../../root/root.js";
import { getRowDragData } from "../../internal.js";

export function RowDragMonitor() {
  const { dropAccept } = useRoot();

  const d = useSelector(dragData);

  const acceptableIds = useMemo(() => {
    return dropAccept.map((x) => x);
  }, [dropAccept]);

  if (!d || acceptableIds.every((x) => !d[x])) return null;

  return <RowDragCollider />;
}

function RowDragCollider() {
  const { viewport, id, api, onRowDragLeave: leave, onRowDragEnter: enter, onRowDrop: drop } = useRoot();
  const x = useSelector(dragX);
  const y = useSelector(dragY);

  // This means the drag account happening here is for us
  const overRef = useRef<null | Over>(null);

  const dropped = useRef(false);

  useEffect(() => {
    if (!viewport) return;
    const controller = new AbortController();

    viewport.addEventListener(
      "drop",
      (ev) => {
        ev.stopPropagation();
        ev.stopImmediatePropagation();
        ev.preventDefault();

        const source = getRowDragData();

        if (!overRef.current) return;

        dropped.current = true;
        drop?.({ source, over: overRef.current });
        clearDragGlobals();
      },
      { signal: controller.signal },
    );

    return () => controller.abort();
  }, [drop, id, viewport]);

  useEffect(() => {
    if (!viewport || dropped.current) return;

    const source = getRowDragData()!;

    const element = document.elementFromPoint(x, y) as HTMLElement;
    if (!element || !viewport.contains(element)) {
      if (overRef.current) {
        const current = overRef.current;
        overRef.current = null;
        leave?.({ source, over: current });
      }
      return;
    }

    const row = getNearestRow(id, element);

    // Then the viewport must be hovered
    if (!row) {
      if (overRef.current?.kind === "viewport") return;
      if (overRef.current?.kind === "row") {
        leave?.({ source, over: overRef.current });
      }

      const over: Over = { kind: "viewport", api, element: viewport, id };
      enter?.({ source, over });
      overRef.current = over;
      return;
    }

    if (overRef.current) {
      if (overRef.current.kind === "viewport") {
        leave?.({ source, over: overRef.current });
      }
      if (overRef.current.kind === "row") {
        if (overRef.current.element === row) return;

        leave?.({ source, over: overRef.current });
      }
    }

    const rowIndex = getRowIndexFromEl(row)!;
    const over: Over = { kind: "row", api, id, element: row, row: api.rowByIndex(rowIndex).get()!, rowIndex };

    overRef.current = over;
    enter?.({ source, over });
  }, [api, drop, enter, id, leave, viewport, x, y]);

  return null;
}

type Over =
  | {
      kind: "row";
      id: string;
      api: Root.API;
      row: RowNode<any>;
      rowIndex: number;
      element: HTMLElement;
    }
  | { kind: "viewport"; id: string; element: HTMLElement; api: Root.API };
