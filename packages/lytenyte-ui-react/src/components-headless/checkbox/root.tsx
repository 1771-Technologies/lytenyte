import { createContext, useCallback, type PropsWithChildren } from "react";
import { useControlled } from "../../hooks/use-controlled.js";

export interface RootProps {
  readonly indeterminate?: boolean;
  readonly checked?: boolean;
  readonly checkedInitial?: boolean;
  readonly onCheckedChange?: (b: boolean) => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const context = createContext({} as Required<Omit<RootProps, "checkedInitial">>);

export const Root = ({
  indeterminate = false,
  checked,
  onCheckedChange,
  checkedInitial,
  children,
}: PropsWithChildren<RootProps>) => {
  const [c, onChange] = useControlled({ controlled: checked, default: checkedInitial ?? false });

  const checkedChange = useCallback(
    (b: boolean) => {
      onChange(b);
      onCheckedChange?.(b);
    },
    [onChange, onCheckedChange],
  );

  return (
    <context.Provider value={{ checked: c, onCheckedChange: checkedChange, indeterminate }}>
      {children}
    </context.Provider>
  );
};
