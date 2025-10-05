import { useSlot, type SlotComponent } from "@1771technologies/lytenyte-core/yinternal";
import { forwardRef, type JSX } from "react";
import { useFilterSelectRoot } from "./context.js";

export interface ApplyProps {
  readonly as?: SlotComponent<{ onApply: () => void }>;
}

function ApplyImpl(
  { as, ...props }: JSX.IntrinsicElements["button"] & ApplyProps,
  ref: JSX.IntrinsicElements["button"]["ref"],
) {
  const ctx = useFilterSelectRoot();
  const slot = useSlot({
    props: [
      {
        onClick: ctx.apply,
      },
      props,
    ],
    ref: ref,
    slot: as ?? <button>Apply</button>,
    state: {
      onReset: ctx.apply,
    },
  });
  return slot;
}

export const Apply = forwardRef(ApplyImpl);
