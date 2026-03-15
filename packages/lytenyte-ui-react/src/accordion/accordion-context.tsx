import { createContext, useContext } from "react";

export interface AccordionContextValue {
  readonly rootId: string;
  readonly collapsible: boolean;
  readonly hiddenUntilFound: boolean;
  readonly keepMounted: boolean;
  readonly disabled: boolean;
  readonly value: any[];
  readonly attrs: Record<string, string | boolean | undefined>;
  readonly orientation: "vertical" | "horizontal";
  readonly onValueChange: (v: any) => void;
}

const context = createContext({} as AccordionContextValue);

export const AccordionRootProvider = context.Provider;
export const useAccordionRoot = () => useContext(context);
