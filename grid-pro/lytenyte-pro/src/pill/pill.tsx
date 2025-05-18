import "./pill.css";
import { clsx } from "@1771technologies/js-utils";
import { forwardRef, type JSX } from "react";

export interface PillProps {
  kind?: "plain" | "column-pivot" | "row-group" | "column" | ({} & string);
  interactive?: boolean;
}

export const Pill = forwardRef<HTMLDivElement, JSX.IntrinsicElements["div"] & PillProps>(
  function Pill({ className, interactive, kind = "plain", ...props }, ref) {
    return (
      <div
        {...props}
        className={clsx("lng1771-pill", className)}
        ref={ref}
        data-pill-interactive={interactive}
        data-pill-kind={kind}
      />
    );
  },
);
