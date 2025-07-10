import type { JSX } from "react";
import { tw } from "../utils";

export interface SeparatorProps {
  orientation?: "horizontal" | "vertical";
}
export function Separator({
  orientation = "vertical",
  ...props
}: Omit<JSX.IntrinsicElements["div"], "children"> & SeparatorProps) {
  return (
    <div
      {...props}
      className={tw(
        orientation === "vertical" && "h-full w-px bg-gray-300",
        orientation === "horizontal" && "h-px w-full bg-gray-300",
        props.className,
      )}
    />
  );
}
