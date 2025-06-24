import type { JSX } from "react";
import { tw } from "../utils";

export function Button(props: JSX.IntrinsicElements["button"]) {
  return <button {...props} className={tw(props.className, "flex cursor-pointer items-center")} />;
}
