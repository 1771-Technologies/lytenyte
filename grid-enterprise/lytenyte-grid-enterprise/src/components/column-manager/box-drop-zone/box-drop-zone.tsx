import "./box-drop-zone.css";
import { clsx } from "@1771technologies/js-utils";
import { type ReactNode } from "react";
import { CollapsedIcon, ExpandedIcon } from "./components";
import type { ColumnEnterpriseReact } from "@1771technologies/grid-types";
import { useDroppable, type DropParams } from "@1771technologies/react-dragon";

export interface BoxDropZoneRendererProps {
  column: ColumnEnterpriseReact<any>;
  index: number;
}

export interface BoxDropZone {
  readonly collapsed: boolean;
  readonly onCollapseChange: (c: boolean) => void;
  readonly emptyLabel: string;
  readonly emptyIcon: ReactNode;
  readonly label: string;
  readonly icon: ReactNode;

  readonly items: ColumnEnterpriseReact<any>[];
  readonly renderer: (p: BoxDropZoneRendererProps) => ReactNode;

  readonly tags: string[];
  readonly onDrop: (p: DropParams) => void;

  readonly onlyContainer?: boolean;
}
export function BoxDropZone({
  icon,
  label,
  emptyLabel,
  emptyIcon,
  collapsed,
  onCollapseChange,
  items,
  renderer: Renderer,
  onDrop,
  tags,
  onlyContainer,
}: BoxDropZone) {
  const { isOver, canDrop, ...props } = useDroppable({
    tags,
    onDrop,
  });

  return (
    <div className="lng1771-box-drop-zone">
      <div className="lng1771-box-drop-zone__controls">
        <div className="lng1771-box-drop-zone__controls-icon">{icon}</div>
        <div className="lng1771-box-drop-zone__controls-label">{label}</div>
        {collapsed ? (
          <CollapsedIcon onClick={() => onCollapseChange(!collapsed)} />
        ) : (
          <ExpandedIcon onClick={() => onCollapseChange(!collapsed)} />
        )}
      </div>
      {!collapsed && (
        <div
          tabIndex={0}
          {...props}
          onKeyDown={(ev) => {
            if (items.length === 0) return;

            if (ev.key === "ArrowDown") {
              ev.preventDefault();
              ev.stopPropagation();

              const active = document.activeElement!;
              const next =
                active === ev.currentTarget
                  ? (active.firstElementChild as HTMLElement)
                  : (active.nextElementSibling as HTMLElement);

              if (!next) return;

              next.focus();
            }
            if (ev.key === "ArrowUp") {
              ev.preventDefault();
              ev.stopPropagation();

              const active = document.activeElement!;
              const next = active.previousElementSibling as HTMLElement;
              if (!next) return;

              next.focus();
            }
          }}
          className={clsx(
            "lng1771-box-drop-zone__box",
            isOver && canDrop && onlyContainer && "lng1771-box-drop-zone_box--over",
          )}
        >
          {items.length === 0 && (
            <div className="lng1771-box-drop-zone__box-item">
              {isOver && canDrop && !onlyContainer && (
                <div className="lng1771-box-drop-zone__drop-indicator" />
              )}
              <div className="lng1771-box-drop-zone__empty-icon">{emptyIcon}</div>
              <div className="lng1771-box-drop-zone__empty-label">{emptyLabel}</div>
            </div>
          )}
          {items.map((c, i) => {
            return <Renderer column={c} key={c.id} index={i} />;
          })}
          {isOver && canDrop && !onlyContainer && items.length > 0 && (
            <div className="lng1771-box-drop-zone__item-drop-indicator" />
          )}
        </div>
      )}
    </div>
  );
}
