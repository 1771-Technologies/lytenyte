import { forwardRef, type JSX } from "react";
import { MultiComboTrigger } from "./multi-combo-trigger.js";
import type { SlotComponent } from "../../../hooks/use-slot/types.js";

export type MultiTriggerProps = JSX.IntrinsicElements["div"] & {
  readonly render?: SlotComponent;
};

function MultiTriggerBase({ render, ...props }: MultiTriggerProps, ref: JSX.IntrinsicElements["div"]["ref"]) {
  const overrides = { __is_trigger: true };
  return <MultiComboTrigger {...props} renderInput={render} ref={ref} {...overrides} />;
}

export const MultiTrigger = forwardRef(MultiTriggerBase);
