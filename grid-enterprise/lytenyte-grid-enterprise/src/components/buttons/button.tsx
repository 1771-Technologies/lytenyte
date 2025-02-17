import { clsx } from "@1771technologies/js-utils";
import type { JSX } from "react";

export function Button(props: JSX.IntrinsicElements["button"]) {
  return <button {...props} className={clsx("lng1771-button", props.className)} />;
}
