import { forwardRef, memo, useRef, useState, type JSX, type ReactNode } from "react";
import { useSlot } from "../../hooks/use-slot/index.js";
import type { PillItemSpec, PillRowSpec } from "./types.js";
import { usePillRow } from "./pill-row.context.js";
import {
  getDragData,
  getDragDirection,
  useDraggable,
  useEvent,
} from "@1771technologies/lytenyte-core-experimental/internal";
import { DragDots } from "./icons.js";
import { usePillRoot } from "./root.context.js";
import { equal, moveRelative, type Writable } from "@1771technologies/lytenyte-shared";

function PillItemBase({ item, elementEnd, ...props }: PillItem.Props, ref: PillItem.Props["ref"]) {
  const { expandToggle, expanded, row } = usePillRow();
  const {
    prevRowId,
    prevSwapId,
    movedRef,
    setDragState,
    setCloned,
    cloned,
    rows,

    orientation,

    onPillItemThrown,
    onPillItemActiveChange,
    onPillRowChange,
  } = usePillRoot();

  const clonedRef = useRef(cloned);
  clonedRef.current = cloned;

  const {
    isDragActive,
    placeholder,
    props: dragProps,
  } = useDraggable({
    data: { pill: { data: { item, id: row.id }, kind: "site" } },

    onUnhandledDrop: () => {
      onPillItemThrown?.({
        index: rows.findIndex((x) => x.id === row.id)!,
        item,
        row: rows.find((x) => x.id === row.id)!,
      });
    },

    onDragStart: () => {
      setDragState({ activeId: item.id, activeRow: row.id, activeType: row.type ?? "" });
      setCloned(structuredClone(rows));
    },

    onDragEnd: () => {
      prevRowId.current = null;
      prevSwapId.current = null;

      const full = clonedRef.current!;

      if (movedRef.current) {
        const move = movedRef.current;
        const movedPill = full
          .find((x) => x.id === move.id)
          ?.pills.find((x) => x.id === move.pillId) as Writable<PillItemSpec>;
        if (movedPill) movedPill.active = false;
      }

      const changed = clonedRef.current!.filter((x, i) => {
        return !equal(x, rows[i]);
      });

      if (changed.length) {
        onPillRowChange({ changed, full: clonedRef.current! });
      }

      setDragState(null);
      setCloned(null);
    },
  });

  const [_, force] = useState({});
  const handleDragEnter = useEvent((ev) => {
    ev.preventDefault();
    ev.stopPropagation();

    const ds = getDragData() as { pill?: { data: { id: string; item: PillItemSpec } } } | null;
    if (!ds?.pill?.data) return;

    const { item: dragged, id: dragRowId } = ds.pill.data;

    const accepts = new Set([...(row.accepts ?? []), row.id]);
    if (!accepts.has(dragRowId) && !item.tags?.some((x) => accepts.has(x))) return;

    const hasPill = row.pills.find((x) => x.id === dragged.id);

    if (dragged.id === item.id) {
      if (dragRowId !== row.id) (hasPill as any).active = dragged.active;
      force({});
      return;
    }

    if (hasPill) {
      const draggedIndex = row.pills.findIndex((x) => x.id === dragged.id);
      const overIndex = row.pills.findIndex((x) => x.id === item.id);

      const newPills = moveRelative(row.pills, draggedIndex, overIndex);

      if (dragRowId !== row.id) (hasPill as any).active = dragged.active;

      const [horizontal, vertical] = getDragDirection();

      const currentSwapId = row.pills[overIndex].id;
      const currentRowId = row.id;

      if (orientation === "horizontal") {
        if (currentSwapId === prevSwapId.current && currentRowId === prevRowId.current) {
          if (horizontal === "end" && draggedIndex >= overIndex) return;
          if (horizontal === "start" && draggedIndex <= overIndex) return;
        }
      } else {
        if (currentSwapId === prevSwapId.current && currentRowId === prevRowId.current) {
          if (vertical === "bottom" && draggedIndex >= overIndex) return;
          if (vertical === "top" && draggedIndex <= overIndex) return;
        }
      }
      // We are gonna swap these two
      prevSwapId.current = currentSwapId;
      prevRowId.current = currentRowId;

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

  const onItemClick = () => {
    const next = !item.active;
    const nextPill: PillItemSpec = { ...item, active: next };
    const nextPills = [...row.pills];
    nextPills.splice(nextPills.indexOf(item), 1, nextPill);

    const nextRow: PillRowSpec = { ...row, pills: nextPills };

    const index = rows.indexOf(row);

    onPillItemActiveChange({ index, item: nextPill, row: nextRow });
  };

  const s = (
    <div
      tabIndex={-1}
      onClick={onItemClick}
      onKeyDown={(ev) => {
        if (ev.key === " " && document.activeElement === ev.currentTarget) {
          onItemClick?.();
          ev.preventDefault();
        }
      }}
    >
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
      <div>{item.name ?? item.id}</div>
      {elementEnd}
    </div>
  );

  const slot = useSlot({
    props: [item.movable ? dragProps : {}, props, { "data-ln-pill-item": true }],
    ref,
    slot: s,
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
    elementEnd?: ReactNode;
  };
}
