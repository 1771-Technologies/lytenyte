import { createContext, useContext } from "react";

export interface AccordionItemContext {
  readonly collapsible: boolean;
  readonly collapsed: boolean;
  readonly hiddenUntilFound: boolean;
  readonly disabled: boolean;
}

const context = createContext({} as AccordionItemContext);
export const AccordionItemProvider = context.Provider;
export const useAccordionItem = () => useContext(context);
