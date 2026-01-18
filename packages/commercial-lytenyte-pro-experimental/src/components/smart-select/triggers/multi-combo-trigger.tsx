import { forwardRef, useMemo, useRef, useState, type ChangeEvent, type JSX } from "react";
import { useSmartSelect } from "../context.js";
import { useCombinedRefs } from "@1771technologies/lytenyte-core-experimental/internal";
import type { SlotComponent } from "../../../hooks/use-slot/types.js";
import { useSlot } from "../../../hooks/use-slot/use-slot.js";
import { useComboControls } from "./use-combo-controls.js";
import { ChipContextProvider } from "../chip-context.js";

export type MultiComboTriggerProps = JSX.IntrinsicElements["div"] & {
  readonly renderInput?: SlotComponent<{
    query: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    loading: boolean;
    error: unknown;
  }>;
};

function MultiComboBase(
  { renderInput, children, ...p }: MultiComboTriggerProps,
  ref: JSX.IntrinsicElements["div"]["ref"],
) {
  const { kindAndValue, comboState, setTrigger, query } = useSmartSelect();

  if (kindAndValue.kind !== "multi-combo") {
    throw new Error(
      `Cannot use BasicSelectTrigger when SmartSelect kind is not "multi-combo". Found: ${kindAndValue.kind}`,
    );
  }

  const [activeChip, setActiveChip] = useState<string | null>(null);
  const controls = useComboControls(setActiveChip, true);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const slot = useSlot({
    props: [controls],
    slot: renderInput ?? <input />,
    ref: inputRef,
    state: { query, onChange: controls.onChange, loading: comboState.loading, error: comboState.error },
  });

  const combined = useCombinedRefs(setTrigger, ref);

  return (
    <ChipContextProvider value={useMemo(() => ({ activeChip, setActiveChip, inputRef }), [activeChip])}>
      <div
        {...p}
        ref={combined}
        data-ln-smart-select-trigger
        onBlur={() => setActiveChip(null)}
        onClick={() => {
          controls.onClick();
          inputRef.current?.focus();
        }}
      >
        {children}
        {slot}
      </div>
    </ChipContextProvider>
  );
}

export const MultiComboTrigger = forwardRef(MultiComboBase);
