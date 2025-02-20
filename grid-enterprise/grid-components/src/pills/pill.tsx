import { t } from "@1771technologies/grid-design";
import { clsx } from "@1771technologies/js-utils";
import type { ReactNode } from "react";

export interface PillProps {
  readonly label: ReactNode;
  readonly kind: "pivot" | "group" | "plain" | "column";
  readonly startItem?: ReactNode;
  readonly endItem?: ReactNode;

  readonly className?: string;
}

export function Pill({ kind, label, startItem, endItem, className }: PillProps) {
  return (
    <div
      className={clsx(
        "lng1771-text-small",
        css`
          white-space: nowrap;
          flex: 1;
          height: 28px;
          max-height: 28px;
          min-height: 28px;
          display: flex;
          gap: ${t.spacing.space_02};
          align-items: center;
          padding-inline-start: ${t.spacing.space_05};
          padding-inline-end: ${t.spacing.space_10};
          border-radius: ${t.spacing.box_radius_regular};
        `,
        !startItem &&
          !endItem &&
          css`
            padding-inline-start: ${t.spacing.space_10};
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
        className,
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
