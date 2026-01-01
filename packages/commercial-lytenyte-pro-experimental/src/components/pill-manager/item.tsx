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
  const {
    prevRowId,
    prevSwapId,
    setDragState,
    setCloned,
    cloned,
    rows,
    dragState,

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
    data: {
      pill: { data: { item, id: row.id }, kind: "site" },
    },

    onUnhandledDrop: () => {
      onPillItemThrown?.({
        index: rows.findIndex((x) => x.id === row.id)!,
        item,
        row: rows.find((x) => x.id === row.id)!,
      });
    },
    onDragStart: () => {
      setDragState({ activeId: item.id, activeRow: row.id, activeType: row.type ?? "" });
      setCloned([...rows]);
    },
    onDragEnd: () => {
      prevRowId.current = null;
      prevSwapId.current = null;

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

  const handleDragEnter = useEvent((ev) => {
    ev.preventDefault();
    ev.stopPropagation();

    const ds = getDragData() as { pill?: { data: { id: string; item: PillItemSpec } } } | null;
    if (!ds?.pill?.data) return;

    const { item: dragged } = ds.pill.data;

    const hasId = row.pills.find((x) => x.id === dragged.id);

    if (dragged.id === item.id) return;

    if (hasId) {
      const draggedIndex = row.pills.findIndex((x) => x.id === dragged.id);
      const overIndex = row.pills.findIndex((x) => x.id === item.id);

      const newPills = moveRelative(row.pills, draggedIndex, overIndex);

      const [horizontal] = getDragDirection();

      const currentSwapId = row.pills[overIndex].id;
      const currentRowId = row.id;

      if (currentSwapId === prevSwapId.current && currentRowId === prevRowId.current) {
        if (horizontal === "end" && draggedIndex >= overIndex) return;
        if (horizontal === "start" && draggedIndex <= overIndex) return;
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

  const s = render ?? (
    <div
      tabIndex={-1}
      onClick={onItemClick}
      onKeyDown={(ev) => {
        if (ev.key === " " && document.activeElement === ev.currentTarget) {
          onItemClick?.();
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
      <div>{item.id}</div>
    </div>
  );

  const slot = useSlot({
    props: [item.movable ? dragProps : {}, props, { "data-ln-pill-item": true }],
    ref,
    slot: render ?? s,
    state: {
      item,
      expanded,
      expandToggle,
      row,
    },
  });

  const isActive = dragState?.activeId === item.id;
  const type = isActive ? dragState.activeType : row.type;

  return (
    <div
      data-ln-pill-type={type}
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
