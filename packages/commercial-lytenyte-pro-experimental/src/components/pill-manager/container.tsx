import { forwardRef, memo, useEffect, useState, type JSX } from "react";
import { usePillRoot } from "./root.context.js";
import { usePillRow } from "./pill-row.context.js";
import {
  dragX,
  dragY,
  getDragData,
  useCombinedRefs,
  useSelector,
} from "@1771technologies/lytenyte-core-experimental/internal";
import type { PillItemSpec } from "./types.js";

function ContainerBase(props: PillContainer.Props, forwarded: PillContainer.Props["ref"]) {
  const { setCloned, orientation, rows } = usePillRoot();
  const { row } = usePillRow();

  const [over, setOver] = useState(false);

  const x = useSelector(dragX);
  const y = useSelector(dragY);

  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (!container) return;

    const ds = getDragData() as { pill?: { data: { id: string; item: PillItemSpec } } } | null;
    if (!ds?.pill?.data) {
      setOver(false);
      return;
    }
    const { item: dragged, id } = ds.pill.data;
    if (id === row.id) return;

    const thisRow = rows.findIndex((x) => x.id === row.id);
    const originalRow = rows[thisRow];

    const bb = container.getBoundingClientRect();
    if (bb.left < x && bb.right > x && bb.top < y && bb.bottom > y) {
      // I am inside
      if (row.pills.find((x) => x.id === dragged.id)) return;

      if (!row.accepts || !dragged.tags || dragged.tags.every((x) => !row.accepts?.includes(x))) return;

      setOver(true);
      const thisRow = rows.findIndex((x) => x.id === row.id);
      const originalRow = rows[thisRow];

      const newPills = [...originalRow.pills, { ...dragged, __temp: true }];

      setCloned((prev) => {
        if (!prev) throw new Error("Can't call drag function without cloning nodes.");

        const newPill = { ...prev[thisRow] };
        newPill.pills = newPills;

        const newDef = [...prev];
        newDef[thisRow] = newPill;

        return newDef;
      });
    } else {
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
  }, [container, row, rows, setCloned, x, y]);

  const combined = useCombinedRefs(forwarded, setContainer);

  return (
    <div
      {...props}
      ref={combined}
      data-ln-over={over}
      data-ln-orientation={orientation}
      data-ln-pill-container
      data-ln-pill-type={row.type}
      onDrop={(e) => {
        e.preventDefault();
        e.stopPropagation();
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
