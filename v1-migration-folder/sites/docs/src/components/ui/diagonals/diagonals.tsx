import { tw } from "../../utils";
import "./diagonals.css";
import type { JSX } from "react";

export function Diagonals({
  alternate,
  ...props
}: Omit<JSX.IntrinsicElements["div"], "children"> & { alternate?: boolean }) {
  return (
    <div
      {...props}
      aria-hidden
      className={tw(alternate ? "diagonal-bg-alt" : "diagonal-bg", props.className)}
    />
  );
}
