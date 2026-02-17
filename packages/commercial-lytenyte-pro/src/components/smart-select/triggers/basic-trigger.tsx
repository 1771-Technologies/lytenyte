import { forwardRef, type JSX } from "react";
import { useSmartSelect } from "../context.js";
import { mergeProps } from "../../../hooks/use-slot/merge-props.js";
import { useCombinedRefs } from "@1771technologies/lytenyte-core/internal";
import { useSelectControls } from "./use-trigger-controls.js";

const noop = () => {};
function BasicSelectTriggerBase(
  props: JSX.IntrinsicElements["button"],
  ref: JSX.IntrinsicElements["button"]["ref"],
) {
  const { kindAndValue, setTrigger, inputRef, open } = useSmartSelect();

  if (kindAndValue.kind !== "basic") {
    throw new Error(
      `Cannot use BasicSelectTrigger when SmartSelect kind is not "basic". Found: ${kindAndValue.kind}`,
    );
  }

  const triggerControls = useSelectControls(false, noop);

  const p = mergeProps(props, triggerControls);

  const combined = useCombinedRefs(setTrigger, ref, inputRef);

  return <button {...p} ref={combined} data-ln-smart-select-trigger data-ln-open={open} />;
}

export const BasicSelectTrigger = forwardRef(BasicSelectTriggerBase);
