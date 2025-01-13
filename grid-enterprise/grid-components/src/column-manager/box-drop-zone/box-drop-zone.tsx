import { t } from "@1771technologies/grid-design";
import type { ReactNode } from "react";

export interface BoxDropZone {
  readonly collapsed: boolean;
  readonly onCollapseChange: (c: boolean) => void;
  readonly emptyLabel: string;
  readonly emptyIcon: ReactNode;
  readonly label: string;
  readonly icon: ReactNode;
}
export function BoxDropZone({ icon, label, emptyLabel, emptyIcon }: BoxDropZone) {
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
          display: grid;
          grid-template-columns: 24px 1fr 24px;
        `}
      >
        <div>{icon}</div>
        <div>{label}</div>
        <div>X</div>
      </div>
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
        <div
          className={css`
            display: flex;
            flex: 1;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            width: 100%;
          `}
        >
          <div>{emptyIcon}</div>
          <div
            className={css`
              text-align: center;
            `}
          >
            {emptyLabel}
          </div>
        </div>
      </div>
    </div>
  );
}
