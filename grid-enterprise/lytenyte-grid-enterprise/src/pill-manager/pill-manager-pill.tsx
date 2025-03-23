import { forwardRef, type JSX } from "react";
import type { PillManagerPillItem } from "./pill-manager";
import { Pill } from "../pill/pill";
import { DragIcon } from "../icons";
import { useDraggable } from "@1771technologies/lytenyte-grid-community/internal";

/**
 * Add drop zones
 * add drop indications
 * add collision detection
 * add swap functionality
 */

export const PillManagerPill = forwardRef<
  HTMLDivElement,
  JSX.IntrinsicElements["div"] & { item: PillManagerPillItem }
>(function PillManagerPill({ item, children, ...props }, ref) {
  return (
    <div
      {...props}
      role="button"
      ref={ref}
      data-pill-active={item.active}
      className="lng1771-pill-manager__pill-outer"
      tabIndex={-1}
      onClick={item.onClick}
    >
      {!children && (
        <Pill
          kind={item.kind}
          className="lng1771-pill-manager__pill-inner"
          interactive
          data-draggable={item.draggable}
        >
          {item.draggable && <DragHandle item={item} />}
          <span>{item.label}</span>
          {item.secondaryLabel && (
            <span className="lng1771-pill-manager__pill-inner--secondary-label">
              {item.secondaryLabel}
            </span>
          )}
        </Pill>
      )}
    </div>
  );
});

function DragHandle({ item }: { item: PillManagerPillItem }) {
  const { onPointerDown } = useDraggable({
    id: item.label,
    getTags: () => item.dragTags,
    getData: () => item.dragData,

    onDragStart: () => {
      document.body.classList.add("lng1771-drag-on");
    },
    onDragEnd: () => {
      document.body.classList.remove("lng1771-drag-on");
    },
  });

  return (
    <button
      className="lng1771-pill-manager__pill-dragger"
      onPointerDownCapture={(ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        onPointerDown(ev);
      }}
      onClickCapture={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <DragIcon width={16} height={16} />
    </button>
  );
}
