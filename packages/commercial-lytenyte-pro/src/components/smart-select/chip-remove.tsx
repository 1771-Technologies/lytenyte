import { forwardRef, type JSX } from "react";
import { useChip } from "./chip.js";

function ChipRemoveBase(props: JSX.IntrinsicElements["button"], ref: JSX.IntrinsicElements["button"]["ref"]) {
  const remove = useChip();

  return (
    <button
      {...props}
      ref={ref}
      onClick={(ev) => {
        props.onClick?.(ev);
        if (ev.isPropagationStopped() || ev.defaultPrevented) return;

        remove();
      }}
    />
  );
}

export const ChipRemove = forwardRef(ChipRemoveBase);
