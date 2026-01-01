import { forwardRef, memo, type JSX } from "react";
import { useSlot, type SlotComponent } from "../../hooks/use-slot/index.js";
import type { PillState } from "./types.js";
import { usePillRow } from "./pill-row.context.js";

function PillRowExpanderBase(
  { render, ...props }: PillRowExpander.Props,
  forwarded: PillRowExpander.Props["ref"],
) {
  const { expandToggle, expanded, row } = usePillRow();

  const slot = useSlot({
    props: [props],
    slot: render ?? <div />,
    ref: forwarded,

    state: {
      expanded,
      expandToggle,
      row,
    } satisfies PillState,
  });

  return slot;
}

export const PillRowExpander = memo(forwardRef(PillRowExpanderBase));

export namespace PillRowExpander {
  export type Props = JSX.IntrinsicElements["div"] & { readonly render?: SlotComponent<PillState> };
}
