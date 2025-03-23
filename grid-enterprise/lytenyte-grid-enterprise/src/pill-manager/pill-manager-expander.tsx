import { clsx } from "@1771technologies/js-utils";
import { forwardRef, type JSX } from "react";

export const PillManagerExpander = forwardRef<HTMLButtonElement, JSX.IntrinsicElements["button"]>(
  function PillManagerExpander(props, ref) {
    return <button {...props} className={clsx("lng1771-pill-manager__expander")} ref={ref} />;
  },
);
