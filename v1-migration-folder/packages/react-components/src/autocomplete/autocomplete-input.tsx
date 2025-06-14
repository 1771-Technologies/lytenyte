import { forwardRef, type JSX } from "react";
import { useForkRef } from "@1771technologies/lytenyte-react-hooks";
import { useSelectRoot } from "../select/context.js";

export const AutocompleteInput = forwardRef<
  HTMLInputElement,
  Omit<JSX.IntrinsicElements["input"], "children" | "value" | "onChange">
>(function SelectInput(props, forwarded) {
  const ctx = useSelectRoot();

  const inputProps = ctx.getInputProps();
  const ref = useForkRef((inputProps as any).ref, forwarded, ctx.setInput);

  return <input {...props} {...inputProps} ref={ref} data-ln-select-open={ctx.state.open} />;
});
