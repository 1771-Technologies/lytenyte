import { forwardRef, type JSX } from "react";
import { useMultiSelectRoot } from "./context.js";
import { useForkRef, useSlot } from "@1771technologies/lytenyte-react-hooks";

export const MultiSelectInput = forwardRef<
  HTMLInputElement,
  Omit<JSX.IntrinsicElements["input"], "children" | "value" | "onChange">
>(function MultiSelectInput(props, forwarded) {
  const ctx = useMultiSelectRoot();

  const inputProps = ctx.getInputProps();
  const ref = useForkRef((inputProps as any).ref, forwarded, ctx.setInput);

  const slot = useSlot({
    props: [props, inputProps, { "data-ln-select-open": ctx.state.open }],
    ref,
    slot: <input />,
  });

  return slot;
});
