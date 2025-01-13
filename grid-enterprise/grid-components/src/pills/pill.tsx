import { clsx } from "@1771technologies/js-utils";
import type { ReactNode } from "react";

export interface PillProps {
  readonly label: ReactNode;
  readonly kind: "pivot" | "group" | "plain" | "column";
  readonly startItem?: ReactNode;
  readonly endItem?: ReactNode;
}

export function Pill({ label, startItem, endItem }: PillProps) {
  return (
    <div
      className={clsx(
        "lng1771-text-small",
        css`
          display: flex;
          align-items: center;
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
