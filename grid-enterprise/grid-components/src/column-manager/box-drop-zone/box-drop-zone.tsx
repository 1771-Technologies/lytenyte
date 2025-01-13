import { t } from "@1771technologies/grid-design";
import { clsx } from "@1771technologies/js-utils";
import type { ReactNode } from "react";
import { CollapsedIcon, ExpandedIcon } from "./components";
import type { ColumnEnterpriseReact } from "@1771technologies/grid-types";

export interface BoxDropZone {
  readonly collapsed: boolean;
  readonly onCollapseChange: (c: boolean) => void;
  readonly emptyLabel: string;
  readonly emptyIcon: ReactNode;
  readonly label: string;
  readonly icon: ReactNode;

  readonly items: ColumnEnterpriseReact<any>[];
  readonly renderer: (p: { column: ColumnEnterpriseReact<any> }) => ReactNode;
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
}: BoxDropZone) {
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
          className={css`
            display: flex;
            min-height: 120px;
            min-width: 260px;
            border-radius: ${t.spacing.box_radius_regular};
            border: 1px dashed ${t.colors.borders_strong};
            background-color: ${t.colors.backgrounds_light};
          `}
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
          {items.map((c) => {
            return <Renderer column={c} key={c.id} />;
          })}
        </div>
      )}
    </div>
  );
}
