import "./button.css";
import { clsx } from "@1771technologies/js-utils";
import type { JSX } from "react";

export function IconButton(props: JSX.IntrinsicElements["button"]) {
  return (
    <button {...props} className={clsx("lng1771-button lng1771-button__icon", props.className)} />
  );
}
