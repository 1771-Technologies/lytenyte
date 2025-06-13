import { forwardRef, type JSX } from "react";
import { useSelectRoot } from "./context";
import { useForkRef } from "@1771technologies/lytenyte-react-hooks";

export const SelectInput = forwardRef<HTMLInputElement, JSX.IntrinsicElements["input"]>(
  function SelectInput(props, forwarded) {
    const ctx = useSelectRoot();

    const inputProps = ctx.getInputProps();
    const ref = useForkRef((inputProps as any).ref, forwarded, ctx.setInput);

    return <input {...props} {...inputProps} ref={ref} readOnly />;
  },
);
