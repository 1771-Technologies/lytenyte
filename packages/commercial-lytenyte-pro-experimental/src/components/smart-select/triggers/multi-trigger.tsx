import { forwardRef, type JSX } from "react";
import { useSmartSelect } from "../context.js";
import { mergeProps } from "../../../hooks/use-slot/merge-props.js";
import { useCombinedRefs } from "@1771technologies/lytenyte-core-experimental/internal";
import { useSelectControls } from "./use-trigger-controls.js";

function MultiTriggerBase(
  props: JSX.IntrinsicElements["button"],
  ref: JSX.IntrinsicElements["button"]["ref"],
) {
  const { kindAndValue, setTrigger } = useSmartSelect();

  if (kindAndValue.kind !== "multi") {
    throw new Error(
      `Cannot use BasicSelectTrigger when SmartSelect kind is not "basic". Found: ${kindAndValue.kind}`,
    );
  }

  const triggerControls = useSelectControls();

  const p = mergeProps(props, triggerControls);

  const combined = useCombinedRefs(setTrigger, ref);

  return <button {...p} ref={combined} />;
}

export const MultiTrigger = forwardRef(MultiTriggerBase);
