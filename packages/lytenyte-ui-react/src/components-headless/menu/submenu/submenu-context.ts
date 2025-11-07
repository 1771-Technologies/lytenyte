import type { JSX } from "react";
import { createContext, useContext } from "react";

interface SubmenuContextValue {
  readonly submenuRef: JSX.IntrinsicElements["div"]["ref"];
  readonly open: boolean;
  readonly onOpenChange: (b: boolean) => void;
}

export const submenuContext = createContext<SubmenuContextValue | null>(null);

export const useSubmenuContext = () => useContext(submenuContext);
