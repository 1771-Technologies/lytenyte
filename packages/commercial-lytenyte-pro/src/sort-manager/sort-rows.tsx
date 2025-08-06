import { forwardRef, type JSX } from "react";
import { Panel } from "../listbox/panel";

export const SortRows = forwardRef<HTMLDivElement, JSX.IntrinsicElements["div"]>(
  function SortRows(props, forwarded) {
    return <Panel {...props} ref={forwarded} />;
  },
);
