import { forwardRef, type JSX } from "react";
import { Panel } from "../../listbox/panel";

export const FilterRows = forwardRef<HTMLDivElement, JSX.IntrinsicElements["div"]>(
  function FilterRows(props, forwarded) {
    return <Panel {...props} ref={forwarded} />;
  },
);
