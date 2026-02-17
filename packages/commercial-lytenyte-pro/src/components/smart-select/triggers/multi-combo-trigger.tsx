import { forwardRef, useMemo, useState, type ChangeEvent, type JSX } from "react";
import { useSmartSelect } from "../context.js";
import { useCombinedRefs } from "@1771technologies/lytenyte-core/internal";
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
  { renderInput, children, ...props }: MultiComboTriggerProps,
  ref: JSX.IntrinsicElements["div"]["ref"],
) {
  const { kindAndValue, comboState, setTrigger, query, inputRef, open } = useSmartSelect();

  const { __is_trigger, ...p } = props as MultiComboTriggerProps & { __is_trigger: boolean };

  if (
    (__is_trigger && kindAndValue.kind !== "multi") ||
    (!__is_trigger && kindAndValue.kind !== "multi-combo")
  ) {
    throw new Error(
      `Cannot use ${__is_trigger ? "MultiTrigger" : "MultiComboTrigger"} when SmartSelect kind is not "${__is_trigger ? "multi" : "multi-combo"}". Found: ${kindAndValue.kind}`,
    );
  }

  const [activeChip, setActiveChip] = useState<string | null>(null);
  const controls = useComboControls(setActiveChip, true);

  const slot = useSlot({
    props: [controls],
    slot:
      renderInput ??
      (__is_trigger ? (
        <button
          style={{
            padding: 0,
            width: 0,
            height: 0,
            background: "transparent",
            border: "0px solid transparent",
          }}
        />
      ) : (
        <input />
      )),
    ref: inputRef,
    state: __is_trigger
      ? {}
      : { query, onChange: controls.onChange, loading: comboState.loading, error: comboState.error },
  });

  const combined = useCombinedRefs(setTrigger, ref);

  return (
    <ChipContextProvider value={useMemo(() => ({ activeChip, setActiveChip }), [activeChip])}>
      <div
        {...p}
        ref={combined}
        data-ln-smart-select-trigger
        data-ln-open={open}
        data-ln-smart-select-loading={comboState.loading}
        data-ln-smart-select-error={!!comboState.error}
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
