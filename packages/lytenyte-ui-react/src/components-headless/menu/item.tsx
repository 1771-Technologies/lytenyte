import { forwardRef, useState, type JSX } from "react";
import { mergeProps } from "../../hooks/use-slot/merge-props.js";

function ItemImpl(props: JSX.IntrinsicElements["li"], ref: JSX.IntrinsicElements["li"]["ref"]) {
  const [active, setActive] = useState(false);

  const merged = mergeProps(props, {
    onFocus: () => {
      setActive(true);
    },
    onBlur: () => {
      setActive(false);
    },
  } satisfies JSX.IntrinsicElements["li"]);

  return (
    <li
      role="menuitem"
      {...merged}
      tabIndex={0}
      data-ln-menu-item
      data-ln-active={active}
      ref={ref}
    />
  );
}

export const Item = forwardRef(ItemImpl);
