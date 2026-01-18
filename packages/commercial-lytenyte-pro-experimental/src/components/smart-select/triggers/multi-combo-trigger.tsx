import { forwardRef, type ChangeEvent, type JSX } from "react";
import { useSmartSelect } from "../context.js";
import { useCombinedRefs } from "@1771technologies/lytenyte-core-experimental/internal";
import type { SlotComponent } from "../../../hooks/use-slot/types.js";
import { useSlot } from "../../../hooks/use-slot/use-slot.js";
import { useComboControls } from "./use-combo-controls.js";

export type MultiComboTriggerProps = JSX.IntrinsicElements["div"] & {
  readonly renderInput?: SlotComponent<{
    query: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  }>;
};

function MultiComboBase(
  { renderInput, children, ...p }: MultiComboTriggerProps,
  ref: JSX.IntrinsicElements["div"]["ref"],
) {
  const { kindAndValue, setTrigger, query } = useSmartSelect();

  if (kindAndValue.kind !== "multi-combo") {
    throw new Error(
      `Cannot use BasicSelectTrigger when SmartSelect kind is not "multi-combo". Found: ${kindAndValue.kind}`,
    );
  }

  const combined = useCombinedRefs(setTrigger, ref);

  const controls = useComboControls();

  const slot = useSlot({
    props: [controls],
    slot: renderInput ?? <input />,
    state: { query, onChange: controls.onChange },
  });

  return (
    <div {...p} ref={combined} data-ln-smart-select-trigger>
      {children}
      {slot}
    </div>
  );
}

export const MultiComboTrigger = forwardRef(MultiComboBase);
