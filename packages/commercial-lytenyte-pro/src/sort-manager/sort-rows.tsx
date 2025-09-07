import { forwardRef, type JSX } from "react";
import { Panel } from "../listbox/panel.js";

export const SortRows = forwardRef<HTMLDivElement, JSX.IntrinsicElements["div"]>(
  function SortRows(props, forwarded) {
    return <Panel {...props} ref={forwarded} />;
  },
);
