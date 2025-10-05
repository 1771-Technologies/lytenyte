import { useSlot, type SlotComponent } from "@1771technologies/lytenyte-core/yinternal";
import { forwardRef, type JSX } from "react";
import { useFilterSelectRoot } from "./context.js";

export interface ResetProps {
  readonly as?: SlotComponent<{ onReset: () => void }>;
}

function ResetImpl(
  { as, ...props }: JSX.IntrinsicElements["button"] & ResetProps,
  ref: JSX.IntrinsicElements["button"]["ref"],
) {
  const ctx = useFilterSelectRoot();
  const slot = useSlot({
    props: [
      {
        onClick: ctx.reset,
      },
      props,
    ],
    ref: ref,
    slot: as ?? <button>Reset</button>,
    state: {
      onReset: ctx.reset,
    },
  });
  return slot;
}

export const Reset = forwardRef(ResetImpl);
