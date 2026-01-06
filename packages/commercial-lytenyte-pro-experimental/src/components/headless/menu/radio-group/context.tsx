import type { JSX } from "react";
import { createContext, forwardRef } from "react";

interface RadioGroupContext {
  readonly value: string;
  readonly onChange?: (v: string) => void;
}

export const context = createContext({} as RadioGroupContext);

const RadioGroupBase = (
  { value, onChange, ...props }: Omit<JSX.IntrinsicElements["div"], "onChange"> & RadioGroupContext,
  ref: JSX.IntrinsicElements["div"]["ref"],
) => {
  return (
    <context.Provider value={{ value: value, onChange: onChange }}>
      <div {...props} ref={ref} role="group">
        {props.children}
      </div>
    </context.Provider>
  );
};
export const RadioGroup = forwardRef(RadioGroupBase);
