import "./separator.css";
import { clsx } from "@1771technologies/js-utils";
import type { CSSProperties } from "react";

export interface SeparatorProps {
  readonly dir: "vertical" | "horizontal";
  readonly soft?: boolean;
  readonly className?: string;
  readonly style?: CSSProperties;
}

export function Separator(props: SeparatorProps) {
  return (
    <div
      role="separator"
      aria-orientation={props.dir}
      className={clsx(
        props.dir === "horizontal" && "lng1771-separator--horizontal",
        props.dir === "vertical" && "lng1771-separator--vertical",
        props.soft && "lng1771-separator--soft",
        props.className,
      )}
      style={props.style}
    ></div>
  );
}
