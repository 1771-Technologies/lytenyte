import "./pill.css";

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
        "lng1771-pill",
        !startItem && !endItem && "lng1771-pill--no-start-end",
        kind === "plain" && "lng1771-pill--plain",
        kind === "group" && "lng1771-pill--group",
        kind === "pivot" && "lng1771-pill--pivot",
        kind === "column" && "lng1771-pill--column",
        className,
      )}
    >
      {startItem && <div className="lng1771-pill__start">{startItem}</div>}
      <div className="lng1771-pill__content">{label}</div>
      {endItem && <div className="lng1771-pill__end">{endItem}</div>}
    </div>
  );
}
