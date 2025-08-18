import { createContext, useContext } from "react";

export interface MenuRadioGroupContext {
  readonly value: any;
  readonly onChange: (v: any) => void;
}

const context = createContext<MenuRadioGroupContext>(null as any);
export const MenuRadioGroupProvider = context.Provider;
export const useMenuRadioGroup = () => useContext(context);
