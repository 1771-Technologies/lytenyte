import { t } from "@1771technologies/grid-design";
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
}: BoxDropZone) {
  const { isOver, canDrop, ...props } = useDroppable({
    tags,
    onDrop,
  });

  return (
    <div
      className={css`
        display: flex;
        flex-direction: column;
        gap: ${t.spacing.space_20};
      `}
    >
      <div
        className={css`
          display: flex;
          align-items: center;
          gap: ${t.spacing.space_10};
        `}
      >
        <div
          className={css`
            color: ${t.colors.borders_icons_default};
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
          `}
        >
          {icon}
        </div>
        <div
          className={clsx(
            "lng1771-text-medium",
            css`
              flex: 1;
            `,
          )}
        >
          {label}
        </div>
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
          className={clsx(css`
            display: flex;
            flex-direction: column;
            min-height: 120px;
            min-width: 260px;
            border-radius: ${t.spacing.box_radius_regular};
            border: 1px dashed ${t.colors.borders_strong};
            background-color: ${t.colors.backgrounds_light};
            &:focus {
              outline: none;
              border: 1px solid ${t.colors.borders_focus};
            }
          `)}
        >
          {items.length === 0 && (
            <div
              className={css`
                display: flex;
                flex: 1;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                width: 100%;
                gap: ${t.spacing.space_10};
              `}
            >
              <div
                className={css`
                  color: ${t.colors.gray_50};
                `}
              >
                {emptyIcon}
              </div>
              <div
                className={clsx(
                  "lng1771-text-small-300",
                  css`
                    text-align: center;
                  `,
                )}
              >
                {emptyLabel}
              </div>
            </div>
          )}
          {items.map((c, i) => {
            return <Renderer column={c} key={c.id} index={i} />;
          })}
          {isOver && canDrop && (
            <div
              className={css`
                height: 1px;
                background-color: ${t.colors.primary_50};
                width: 100%;
              `}
            />
          )}
        </div>
      )}
    </div>
  );
}
