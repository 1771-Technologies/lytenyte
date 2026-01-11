import type { JSX } from "react";
import { createContext, forwardRef } from "react";

interface RadioGroupContext {
  readonly value: string;
  readonly onChange?: (v: string) => void;
}

export const context = createContext({} as RadioGroupContext);

const RadioGroupBase = ({ value, onChange, ...props }: RadioGroup.Props, ref: RadioGroup.Props["ref"]) => {
  return (
    <context.Provider value={{ value: value, onChange: onChange }}>
      <div {...props} ref={ref} role="group">
        {props.children}
      </div>
    </context.Provider>
  );
};
export const RadioGroup = forwardRef(RadioGroupBase);

export namespace RadioGroup {
  export type Props = Omit<JSX.IntrinsicElements["div"], "onChange"> & RadioGroupContext;
}
