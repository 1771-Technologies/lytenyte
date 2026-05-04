import { forwardRef, memo, useEffect, useRef, useState, type JSX } from "react";
import { usePillRoot } from "./root.context.js";
import { usePillRow } from "./pill-row.context.js";
import {
  dragX,
  dragY,
  getDragData,
  useCombinedRefs,
  useSelector,
} from "@1771technologies/lytenyte-core/internal";
import type { PillItemSpec, PillRowSpec } from "./types.js";
import { getFocusables } from "@1771technologies/lytenyte-shared";
import { equal } from "@1771technologies/js-utils";

function ContainerBase(props: PillContainer.Props, forwarded: PillContainer.Props["ref"]) {
  const { setCloned, cloned, orientation, rows, movedRef, onPillRowChange, onPillItemActiveChange } =
    usePillRoot();
  const { row } = usePillRow();

  const [over, setOver] = useState(false);
  const [external, setExternal] = useState(false);

  const x = useSelector(dragX);
  const y = useSelector(dragY);

  const [container, setContainer] = useState<HTMLElement | null>(null);
  const ds = getDragData();
  useEffect(() => {
    if (!ds) setExternal(false);
  }, [ds]);

  const wasOver = useRef(false);
  useEffect(() => {
    if (!container) return;

    const ds = getDragData() as { pill?: { data: { id: string; item: PillItemSpec } } } | null;
    if (!ds?.pill?.data) {
      setOver(false);
      return;
    }

    let { item: dragged, id } = ds.pill.data;

    // We resolve the external item to a dragged item here.
    const originalId = id;
    if (id === "__external__") {
      const d = dragged as unknown as Record<string, string>;
      if (!d[row.id]) return;

      id = row.id;
      dragged = row.pills.find((x) => x.id === d[row.id])!;
      if (!dragged) {
        console.error("Specified an external item, but that item is not in the pill group.");
        return;
      }
    }

    const bb = container.getBoundingClientRect();
    const isOver = bb.left < x && bb.right > x && bb.top < y && bb.bottom > y;

    // The current drag is from the current row.
    if (id === row.id) {
      movedRef.current = !isOver ? { id: row.id, pillId: dragged.id } : null;
      setExternal(isOver && originalId === "__external__");
      return;
    }

    const thisRow = rows.findIndex((x) => x.id === row.id);
    const originalRow = rows[thisRow];

    if (isOver) {
      wasOver.current = true;
      if (row.pills.find((x) => x.id === dragged.id)) return;
      if (!row.accepts || !dragged.tags || dragged.tags.every((x) => !row.accepts?.includes(x))) return;

      setOver(true);
      const thisRow = rows.findIndex((x) => x.id === row.id);
      const originalRow = rows[thisRow];

      const newPills = [...originalRow.pills, { ...dragged, __temp: true }];

      setCloned((prev) => {
        if (!prev) throw new Error("Can't call drag function without cloning nodes.");

        const newPillSpec = { ...prev[thisRow] };
        newPillSpec.pills = newPills;

        const newPillRows = [...prev];
        newPillRows[thisRow] = newPillSpec;

        return newPillRows;
      });
    } else {
      if (wasOver.current) {
        setCloned((prev) => {
          if (!prev) return prev;

          const next = [...prev];
          next[thisRow] = structuredClone(originalRow);

          return next;
        });
        wasOver.current = false;
      }

      setOver(false);
      // The original row has the dragged pill as an ID so we can safely skip it.
      if (originalRow.pills.find((x) => x.id === dragged.id)) return;
      if (!row.pills.find((x) => x.id === dragged.id)) return;

      const newPills = row.pills.filter((x) => x.id !== dragged.id);
      const newRow = { ...row, pills: newPills };

      setCloned((prev) => {
        if (!prev) throw new Error("Can't call drag function without cloning nodes.");

        const newDef = [...prev];
        newDef[thisRow] = newRow;

        return newDef;
      });
    }
  }, [container, movedRef, over, row, rows, setCloned, x, y]);

  const combined = useCombinedRefs(forwarded, setContainer);

  const rtl = useRef<boolean>(null as unknown as false);

  return (
    <div
      {...props}
      ref={combined}
      data-ln-over={over}
      data-ln-external-over={external}
      data-ln-orientation={orientation}
      data-ln-pill-container
      data-ln-pill-type={row.type}
      tabIndex={0}
      onKeyDown={(ev) => {
        if (rtl.current == null) {
          const dir = getComputedStyle(ev.currentTarget).direction;
          rtl.current = dir === "rtl";
        }

        const start = rtl.current ? "ArrowRight" : "ArrowLeft";
        const end = rtl.current ? "ArrowLeft" : "ArrowRight";

        const next = orientation === "horizontal" ? end : "ArrowDown";
        const prev = orientation === "horizontal" ? start : "ArrowUp";

        if (ev.key === next) {
          const focusables = getFocusables(ev.currentTarget);
          if (!focusables.length) return;

          const active = focusables.indexOf(document.activeElement as HTMLElement);
          if (active === -1 || active === focusables.length - 1) {
            focusables[0].focus();
          } else {
            focusables[active + 1].focus();
          }
          ev.preventDefault();
        } else if (ev.key === prev) {
          const focusables = getFocusables(ev.currentTarget);
          if (!focusables.length) return;

          const active = focusables.indexOf(document.activeElement as HTMLElement);
          if (active === -1 || active === 0) {
            focusables.at(-1)?.focus();
          } else {
            focusables[active - 1].focus();
          }
          ev.preventDefault();
        }
      }}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();

        const ds = getDragData() as { pill?: { data: { id: string; item: PillItemSpec } } } | null;
        if (!ds?.pill?.data || ds.pill.data.id != "__external__") return;
        let { item: dragged } = ds.pill.data;

        // We resolve the external item to a dragged item here.
        const d = dragged as unknown as Record<string, string>;
        if (!d[row.id]) return;

        dragged = row.pills.find((x) => x.id === d[row.id])!;

        const changed = cloned?.filter((x, i) => {
          return !equal(x, rows[i]);
        });

        if (!dragged.active) {
          const next = true;
          const nextPill: PillItemSpec = { ...dragged, active: next };
          const nextPills = [...row.pills];
          nextPills.splice(nextPills.indexOf(dragged), 1, nextPill);

          const nextRow: PillRowSpec = { ...row, pills: nextPills };

          const index = rows.indexOf(row);
          onPillItemActiveChange({ index, item: nextPill, row: nextRow });
        }

        (dragged as any).active = true;

        if (changed?.length) {
          onPillRowChange({ changed, full: cloned! });
        }

        setCloned(null);
      }}
      onDragOver={(e) => {
        e.dataTransfer.dropEffect = "move";
        e.preventDefault();
        e.stopPropagation();
      }}
    />
  );
}

export const PillContainer = memo(forwardRef(ContainerBase));

export namespace PillContainer {
  export type Props = JSX.IntrinsicElements["div"];
}
