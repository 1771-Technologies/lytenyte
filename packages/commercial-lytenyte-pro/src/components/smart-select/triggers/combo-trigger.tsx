import { forwardRef, type JSX } from "react";
import { useSmartSelect } from "../context.js";
import { useCombinedRefs } from "@1771technologies/lytenyte-core-experimental/internal";
import { mergeProps } from "../../../hooks/use-slot/merge-props.js";
import { useComboControls } from "./use-combo-controls.js";

const noop = () => {};
function ComboTriggerBase(props: JSX.IntrinsicElements["input"], ref: JSX.IntrinsicElements["input"]["ref"]) {
  const { kindAndValue, setTrigger, inputRef, open, comboState } = useSmartSelect();

  if (kindAndValue.kind !== "combo") {
    throw new Error(
      `Cannot use BasicSelectTrigger when SmartSelect kind is not "combo". Found: ${kindAndValue.kind}`,
    );
  }

  const combined = useCombinedRefs(setTrigger, ref, inputRef);
  const p = mergeProps(props, useComboControls(noop, false));

  return (
    <input
      {...p}
      ref={combined}
      data-ln-smart-select-trigger
      data-ln-open={open}
      data-ln-smart-select-loading={comboState.loading}
      data-ln-smart-select-error={!!comboState.error}
    />
  );
}

export const ComboTrigger = forwardRef(ComboTriggerBase);
