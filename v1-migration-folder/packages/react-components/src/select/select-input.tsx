import { forwardRef, type JSX } from "react";
import { useSelectRoot } from "./context.js";
import { useForkRef } from "@1771technologies/lytenyte-react-hooks";

export const SelectInput = forwardRef<
  HTMLInputElement,
  Omit<JSX.IntrinsicElements["input"], "children" | "value" | "onChange">
>(function SelectInput(props, forwarded) {
  const ctx = useSelectRoot();

  const inputProps = ctx.getInputProps();
  const ref = useForkRef((inputProps as any).ref, forwarded, ctx.setInput);

  return (
    <input {...props} {...inputProps} ref={ref} readOnly data-ln-select-open={ctx.state.open} />
  );
});
