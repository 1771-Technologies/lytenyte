import "./components.css";

import { clsx } from "@1771technologies/js-utils";
import { refCompat } from "@1771technologies/react-utils";
import type { JSX, RefObject } from "react";

const ButtonImpl = ({
  buttonRef,
  ...props
}: JSX.IntrinsicElements["button"] & { buttonRef?: RefObject<HTMLButtonElement | null> }) => {
  return (
    <button
      tabIndex={-1}
      {...props}
      ref={buttonRef}
      className={clsx("lng1771-icon-button", props.className)}
    >
      {props.children}
    </button>
  );
};

export const GridButton = refCompat(ButtonImpl, "Button");

export function CollapseButton(
  props: JSX.IntrinsicElements["button"] & { buttonRef?: RefObject<HTMLButtonElement | null> },
) {
  return <GridButton {...props}>-</GridButton>;
}
export function ExpandButton(
  props: JSX.IntrinsicElements["button"] & { buttonRef?: RefObject<HTMLButtonElement | null> },
) {
  return <GridButton {...props}>+</GridButton>;
}
