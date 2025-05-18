import { clsx } from "@1771technologies/js-utils";
import { forwardRef, type JSX } from "react";
import { usePillRow } from "./pill-manager-row";
import { CollapseIcon, ExpandIcon } from "../icons";

export const PillManagerExpander = forwardRef<HTMLButtonElement, JSX.IntrinsicElements["button"]>(
  function PillManagerExpander({ children, ...props }, ref) {
    const { expanded, setExpanded, pillSource } = usePillRow();
    return (
      <button
        {...props}
        className={clsx("lng1771-pill-manager__expander")}
        ref={ref}
        tabIndex={-1}
        data-pill-expander-source={pillSource}
        onClick={() => {
          setExpanded((prev) => !prev);
        }}
      >
        {!children && (expanded ? <CollapseIcon /> : <ExpandIcon />)}
        {children}
      </button>
    );
  },
);
