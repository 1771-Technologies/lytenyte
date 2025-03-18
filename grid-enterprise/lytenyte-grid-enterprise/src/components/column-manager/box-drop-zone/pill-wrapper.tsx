import "./pill-wrapper.css";
import { clsx } from "@1771technologies/js-utils";
import type { JSX, RefObject } from "react";

export function PillWrapper({
  children,
  isFirst,
  pillRef,
  ...props
}: JSX.IntrinsicElements["div"] & {
  isFirst: boolean;
  pillRef?: RefObject<HTMLDivElement | null>;
}) {
  return (
    <div
      {...props}
      ref={pillRef}
      tabIndex={-1}
      className={clsx(
        "lng1771-pill-wrapper",
        isFirst && "lng1771-pill-wrapper--first",
        props.className,
      )}
    >
      {children}
    </div>
  );
}
