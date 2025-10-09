import { useSlot, type SlotComponent } from "@1771technologies/lytenyte-core/yinternal";
import { forwardRef, type JSX } from "react";
import { useFilterSelectRoot } from "./context.js";

export interface ClearProps {
  readonly as?: SlotComponent<{ onClear: () => void }>;
}

function ClearImpl(
  { as, ...props }: JSX.IntrinsicElements["button"] & ClearProps,
  ref: JSX.IntrinsicElements["button"]["ref"],
) {
  const ctx = useFilterSelectRoot();
  const slot = useSlot({
    props: [
      {
        onClick: ctx.clear,
      },
      props,
    ],
    ref: ref,
    slot: as ?? <button>Clear</button>,
    state: {
      onReset: ctx.clear,
    },
  });
  return slot;
}

export const Clear = forwardRef(ClearImpl);
