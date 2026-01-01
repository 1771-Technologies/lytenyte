import { forwardRef, memo, useRef, type JSX } from "react";
import { useSlot, type SlotComponent } from "../../hooks/use-slot/index.js";
import type { PillItemSpec, PillRowSpec, PillState } from "./types.js";
import { usePillRow } from "./pill-row.context.js";
import {
  getDragData,
  getDragDirection,
  useDraggable,
  useEvent,
} from "@1771technologies/lytenyte-core-experimental/internal";
import { DragDots } from "./icons.js";
import { usePillRoot } from "./root.context.js";
import { equal, moveRelative } from "@1771technologies/lytenyte-shared";

function PillItemBase({ render, item, ...props }: PillItem.Props, ref: PillItem.Props["ref"]) {
  const { expandToggle, expanded, row } = usePillRow();
  const { setDragState, setCloned, cloned, onActiveChange, rows, onPillRowChange } = usePillRoot();

  const clonedRef = useRef(cloned);
  clonedRef.current = cloned;

  const {
    isDragActive,
    placeholder,
    props: dragProps,
  } = useDraggable({
    data: {
      pill: { data: { item, id: row.id }, kind: "site" },
    },

    onDragStart: () => {
      setDragState({ activeId: item.id, activeRow: row.id });
      setCloned([...rows]);
    },
    onDragEnd: () => {
      const changed = clonedRef.current!.filter((x, i) => {
        return !equal(x, rows[i]);
      });

      if (changed.length) {
        onPillRowChange({
          changed,
          full: clonedRef.current!,
        });
      }

      setDragState(null);
      setCloned(null);
    },
  });

  const s = render ?? (
    <div>
      {item.movable && (
        <div
          style={{
            width: 20,
            height: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "grab",
          }}
        >
          <DragDots />
        </div>
      )}
      <div>{item.id}</div>
    </div>
  );

  const handleDragEnter = useEvent((ev) => {
    ev.preventDefault();
    ev.stopPropagation();

    const ds = getDragData() as { pill?: { data: { id: string; item: PillItemSpec } } } | null;
    if (!ds?.pill?.data) return;

    const { item: dragged, id } = ds.pill.data;

    const sameRow = id === row.id;

    if (dragged.id === item.id) return;

    if (sameRow) {
      const draggedIndex = row.pills.findIndex((x) => x.id === dragged.id);
      const overIndex = row.pills.findIndex((x) => x.id === item.id);

      const newPills = moveRelative(row.pills, draggedIndex, overIndex);

      const [horizontal] = getDragDirection();

      if (horizontal === "end" && draggedIndex >= overIndex) return;
      if (horizontal === "start" && draggedIndex <= overIndex) return;

      setCloned((prev) => {
        if (!prev) throw new Error("Can't call drag function without cloning nodes.");

        const thisRow = prev.findIndex((x) => x.id === row.id);
        const newPill = { ...prev[thisRow] };
        newPill.pills = newPills;

        const newDef = [...prev];
        newDef[thisRow] = newPill;

        return newDef;
      });

      return;
    }

    // If here we need to check if this row accepts items the dragged.
    if (!row.accepts || !dragged.tags || dragged.tags.every((x) => !row.accepts?.includes(x))) return null;

    const thisRow = rows.findIndex((x) => x.id === row.id);
    const originalRow = rows[thisRow];

    // The original row has this id so we can't dragged a new item to it.
    if (originalRow.pills.find((x) => x.id === dragged.id)) return;

    const overIndex = row.pills.findIndex((x) => x.id === item.id);
    const draggedIndex = row.pills.findIndex((x) => x.id === dragged.id);

    let newPills: PillItemSpec[];
    if (draggedIndex !== -1) {
      const [horizontal] = getDragDirection();

      if (horizontal === "end" && draggedIndex >= overIndex) return;
      if (horizontal === "start" && draggedIndex <= overIndex) return;

      newPills = moveRelative(row.pills, draggedIndex, overIndex);
    } else {
      newPills = [...originalRow.pills];
      newPills.splice(overIndex, 0, dragged as PillItemSpec);
    }

    setCloned((prev) => {
      if (!prev) throw new Error("Can't call drag function without cloning nodes.");

      const newPill = { ...prev[thisRow] };
      newPill.pills = newPills;

      const newDef = [...prev];
      newDef[thisRow] = newPill;

      return newDef;
    });
  });

  const itemProps: JSX.IntrinsicElements["div"] = {
    onClick: () => {
      const next = !item.active;
      const nextPill: PillItemSpec = { ...item, active: next };
      const nextPills = [...row.pills];
      nextPills.splice(nextPills.indexOf(item), 1, nextPill);

      const nextRow: PillRowSpec = { ...row, pills: nextPills };

      const index = rows.indexOf(row);

      onActiveChange({ index, item: nextPill, row: nextRow });
    },
  };

  const slot = useSlot({
    props: [itemProps, item.movable ? dragProps : {}, props, { "data-ln-pill-item": true }],
    ref,
    slot: render ?? s,
    state: {
      item,
      expanded,
      expandToggle,
      row,
    },
  });

  return (
    <div
      data-ln-pill-type={row.type}
      data-ln-pill-item-container
      data-ln-pill-active={item.active}
      data-ln-draggable={item.movable}
      data-ln-drag-active={isDragActive}
      style={{
        userSelect: "none",
        msUserSelect: "none",
        WebkitUserSelect: "none",
        position: "relative",
      }}
      onDragLeave={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
      onDragEnter={handleDragEnter}
    >
      {slot}
      {placeholder}
    </div>
  );
}

export const PillItem = memo(forwardRef(PillItemBase));

export namespace PillItem {
  export type Props = JSX.IntrinsicElements["div"] & { item: PillItemSpec } & {
    readonly render?: SlotComponent<PillState & { item: PillItemSpec }>;
  };
}
