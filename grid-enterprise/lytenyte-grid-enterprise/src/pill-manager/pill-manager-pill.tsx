import { forwardRef, type JSX } from "react";
import { Pill } from "../pill/pill";
import { DragIcon } from "../icons";
import { useDraggable, useDroppable } from "@1771technologies/lytenyte-grid-community/internal";
import { useCombinedRefs } from "@1771technologies/react-utils";
import { useGrid } from "../use-grid";
import type { PillManagerPillItem } from "./pill-manager-types";
import { usePillControls } from "./pill-manager-controls";
import { Menu } from "../external";
import { useComponents } from "./pill-manager";

/**
 * add swap functionality
 */

export const PillManagerPill = forwardRef<
  HTMLDivElement,
  Omit<JSX.IntrinsicElements["div"], "children"> & { item: PillManagerPillItem }
>(function PillManagerPill({ item, ...props }, ref) {
  const {
    ref: dropRef,
    isTarget,
    canDrop,
    xHalf,
  } = useDroppable({
    id: item.dropId,
    accepted: item.dropTags,
    data: item.dropData,
    active: item.active,
  });

  const grid = useGrid();
  const rtl = grid.state.rtl.use();
  const combinedRefs = useCombinedRefs(ref, dropRef);

  const { activePill } = usePillControls();
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
      className="lng1771-pill-manager__pill-outer"
      onClick={item.onClick}
    >
      <Pill
        kind={item.kind}
        data-pill-focused={item.dropId === activePill}
        className="lng1771-pill-manager__pill-inner"
        interactive
        data-draggable={item.draggable}
      >
        {item.draggable && <DragHandle item={item} />}
        {item.isAggregation && (
          <Menu.Root>
            <Menu.Trigger className="lng1771-pill-manager__menu-trigger">
              <TriggerIcon width={16} height={16} />
            </Menu.Trigger>
            <Menu.Portal>
              <Menu.Positioner onClick={(ev) => ev.stopPropagation()}>
                <AggMenu grid={grid} column={item.column!} />
              </Menu.Positioner>
            </Menu.Portal>
          </Menu.Root>
        )}
        {item.isMeasure && (
          <Menu.Root>
            <Menu.Trigger className="lng1771-pill-manager__menu-trigger">
              <TriggerIcon width={16} height={16} />
            </Menu.Trigger>
            <Menu.Portal>
              <Menu.Positioner onClick={(ev) => ev.stopPropagation()}>
                <MeasureMenu grid={grid} column={item.column!} />
              </Menu.Positioner>
            </Menu.Portal>
          </Menu.Root>
        )}
        <span>{item.label}</span>
        {item.secondaryLabel && (
          <span className="lng1771-pill-manager__pill-inner--secondary-label">
            {item.secondaryLabel}
          </span>
        )}
      </Pill>
      {canDrop && (rtl ? "left" : "right") === xHalf && (
        <div className="lng1771-pill-manager__drop-indicator-end" />
      )}
      {canDrop && (rtl ? "right" : "left") === xHalf && (
        <div className="lng1771-pill-manager__drop-indicator-start" />
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
      className="lng1771-pill-manager__pill-dragger"
      onPointerDown={onPointerDown}
    >
      <DragIcon width={16} height={16} />
    </button>
  );
}
