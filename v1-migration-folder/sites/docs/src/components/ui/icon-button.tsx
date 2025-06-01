import type { JSX } from "react";
import { tw } from "../utils";

export const IconButton = (props: JSX.IntrinsicElements["button"]) => {
  return (
    <button
      {...props}
      className={tw(
        "flex size-8 cursor-pointer items-center justify-center rounded transition-colors hover:bg-gray-200",
        "focus-visible:outline-brand-500/40 focus-visible:bg-gray-200 focus-visible:outline-1",
        props.className,
      )}
    />
  );
};
