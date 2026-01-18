import { forwardRef, type JSX } from "react";
import { useSmartSelect } from "../context.js";
import { useCombinedRefs } from "@1771technologies/lytenyte-core-experimental/internal";
import { mergeProps } from "../../../hooks/use-slot/merge-props.js";
import { useComboControls } from "./use-combo-controls.js";

function ComboTriggerBase(props: JSX.IntrinsicElements["input"], ref: JSX.IntrinsicElements["input"]["ref"]) {
  const { kindAndValue, setTrigger } = useSmartSelect();

  if (kindAndValue.kind !== "combo") {
    throw new Error(
      `Cannot use BasicSelectTrigger when SmartSelect kind is not "combo". Found: ${kindAndValue.kind}`,
    );
  }

  const combined = useCombinedRefs(setTrigger, ref);
  const p = mergeProps(props, useComboControls());

  return <input {...p} ref={combined} data-ln-smart-select-trigger />;
}

export const ComboTrigger = forwardRef(ComboTriggerBase);
