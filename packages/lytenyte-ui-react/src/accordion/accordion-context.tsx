import { createContext, useContext } from "react";

export interface AccordionContextValue {
  readonly collapsible: boolean;
  readonly hiddenUntilFound: boolean;
  readonly disabled: boolean;
}

const context = createContext({} as AccordionContextValue);

export const AccordionRootProvider = context.Provider;
export const useAccordionRoot = () => useContext(context);
