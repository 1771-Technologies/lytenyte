import { forwardRef, memo, type JSX } from "react";
import { useSlot, type SlotComponent } from "../../hooks/use-slot/index.js";
import type { PillState } from "./types.js";
import { usePillRow } from "./pill-row.context.js";
import { CollapseIcon, ExpandIcon, Icon } from "./icons.js";

function PillRowExpanderBase(
  { render, ...props }: PillRowExpander.Props,
  forwarded: PillRowExpander.Props["ref"],
) {
  const { expandToggle, expanded, row } = usePillRow();

  const expander = render ?? (
    <div data-ln-pill-expander>
      <button
        data-ln-button="secondary"
        data-ln-size="md"
        data-ln-expanded={expanded}
        data-ln-icon
        onClick={() => expandToggle()}
      >
        <Icon>{expanded ? <CollapseIcon /> : <ExpandIcon />}</Icon>
      </button>
    </div>
  );

  const slot = useSlot({
    props: [props],
    slot: expander,
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
