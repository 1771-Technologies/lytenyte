import { forwardRef, type JSX } from "react";
import { useForkRef } from "@1771technologies/lytenyte-react-hooks";
import { useDropComboRoot } from "./context.js";

export const DropComboInput = forwardRef<
  HTMLInputElement,
  Omit<JSX.IntrinsicElements["input"], "children" | "value" | "onChange">
>(function DropComboInput(props, forwarded) {
  const ctx = useDropComboRoot();

  const inputProps = ctx.getInputProps();
  const ref = useForkRef((inputProps as any).ref, forwarded, ctx.setInput);

  return <input {...props} {...inputProps} ref={ref} />;
});
