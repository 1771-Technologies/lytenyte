import { t } from "@1771technologies/grid-design";
import { clsx } from "@1771technologies/js-utils";
import type { ReactNode } from "react";

export interface PillProps {
  readonly label: ReactNode;
  readonly kind: "pivot" | "group" | "plain" | "column";
  readonly startItem?: ReactNode;
  readonly endItem?: ReactNode;
}

export function Pill({ kind, label, startItem, endItem }: PillProps) {
  return (
    <div
      className={clsx(
        "lng1771-text-small",
        css`
          flex: 1;
          height: 28px;
          max-height: 28px;
          min-height: 28px;
          display: flex;
          align-items: center;
          padding-inline-start: ${t.spacing.space_05};
          padding-inline-end: ${t.spacing.space_10};
          border-radius: ${t.spacing.box_radius_regular};
        `,
        kind === "plain" &&
          css`
            background-color: ${t.colors.system_plain_pill_fill};
            border: 1px solid ${t.colors.system_plain_pill_fill};
          `,

        kind === "group" &&
          css`
            background-color: ${t.colors.system_group_pill_fill};
            border: 1px solid ${t.colors.system_group_pill_stroke};
          `,

        kind === "pivot" &&
          css`
            background-color: ${t.colors.system_pivot_pill_fill};
            border: 1px solid ${t.colors.system_pivot_pill_stroke};
          `,
        kind === "column" &&
          css`
            background-color: ${t.colors.system_column_pill_fill};
            border: 1px solid ${t.colors.system_column_pill_stroke};
          `,
      )}
    >
      {startItem && <div>{startItem}</div>}
      <div
        className={css`
          flex: 1;
        `}
      >
        {label}
      </div>
      {endItem && <div>{endItem}</div>}
    </div>
  );
}
