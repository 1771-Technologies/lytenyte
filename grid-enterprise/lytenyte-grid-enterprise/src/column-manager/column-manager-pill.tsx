import { forwardRef, type JSX } from "react";
import { Pill } from "../pill/pill";
import { CrossIcon, DragIcon } from "../icons";
import { useDraggable, useDroppable } from "@1771technologies/lytenyte-grid-community/internal";
import { useCombinedRefs } from "@1771technologies/react-utils";
import { useGrid } from "../use-grid";
import { Menu } from "../external";
import type { PillManagerPillItem } from "../pill-manager/pill-manager-types";
import { useComponents } from "./column-mananger-context";

export const ColumnManagerPill = forwardRef<
  HTMLDivElement,
  Omit<JSX.IntrinsicElements["div"], "children"> & { item: PillManagerPillItem }
>(function ColumnManagerPill({ item, ...props }, ref) {
  const {
    ref: dropRef,
    isTarget,
    canDrop,
    yHalf,
  } = useDroppable({
    id: item.dropId,
    accepted: item.dropTags,
    data: item.dropData,
    active: item.active,
  });

  const grid = useGrid();
  const combinedRefs = useCombinedRefs(ref, dropRef);

  const {
    aggMenuRenderer: AggMenu,
    measureMenuRenderer: MeasureMenu,
    menuTriggerIcon: TriggerIcon,
  } = useComponents();

  return (
    <div
      {...props}
      role="button"
      ref={combinedRefs}
      data-pill-key={item.dropId}
      data-pill-active={item.active}
      data-is-droppable={isTarget && canDrop}
      className="lng1771-column-manager__pill-outer"
    >
      <Pill
        kind={item.kind}
        className="lng1771-column-manager__pill-inner"
        interactive
        data-draggable={item.draggable}
      >
        {item.draggable && <DragHandle item={item} />}

        <div className="lng1771-column-manager__pill-labels">
          <span>{item.label}</span>
          {item.secondaryLabel && (
            <span className="lng1771-column-manager__pill-inner--secondary-label">
              {item.secondaryLabel}
            </span>
          )}
        </div>

        {(item.isAggregation || item.isMeasure) && (
          <Menu.Root>
            <Menu.Trigger
              className="lng1771-column-manager__pill-button"
              data-pill-menu-trigger="true"
              tabIndex={-1}
              onClick={(e) => e.stopPropagation()}
            >
              <TriggerIcon width={16} height={16} />
            </Menu.Trigger>
            <Menu.Portal>
              <Menu.Positioner onClick={(ev) => ev.stopPropagation()}>
                {item.isAggregation && <AggMenu grid={grid} column={item.column!} />}
                {item.isMeasure && <MeasureMenu grid={grid} column={item.column!} />}
              </Menu.Positioner>
            </Menu.Portal>
          </Menu.Root>
        )}

        {(item.isRowGroup || item.isColumnPivot || item.isAggregation || item.isMeasure) && (
          <button className="lng1771-column-manager__pill-button" onClick={item.onClick}>
            <CrossIcon width={16} height={16} />
          </button>
        )}
      </Pill>
      {canDrop && "bottom" === yHalf && (
        <div className="lng1771-column-manager__drop-indicator-end" />
      )}
      {canDrop && "top" === yHalf && (
        <div className="lng1771-column-manager__drop-indicator-start" />
      )}
    </div>
  );
});

function DragHandle({ item }: { item: PillManagerPillItem }) {
  const { onPointerDown } = useDraggable({
    id: item.label,
    getTags: () => item.dragTags,
    getData: () => item?.dragData,

    onDragStart: () => {
      document.body.classList.add("lng1771-drag-on");
    },
    onDragCancel: () => {
      document.body.classList.remove("lng1771-drag-on");
    },
    onDragEnd: (p) => {
      item.dragEnd?.(p);
      document.body.classList.remove("lng1771-drag-on");
    },
  });

  return (
    <button
      tabIndex={-1}
      className="lng1771-column-manager__pill-dragger"
      onPointerDown={onPointerDown}
    >
      <DragIcon width={16} height={16} />
    </button>
  );
}
