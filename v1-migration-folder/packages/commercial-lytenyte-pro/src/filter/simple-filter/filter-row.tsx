import { forwardRef, type JSX } from "react";
import { Item } from "../../listbox/item";

export const FilterRow = forwardRef<HTMLDivElement, JSX.IntrinsicElements["div"]>(
  function FilterRow({ ...props }, forwarded) {
    return <Item {...props} ref={forwarded} />;
  },
);
