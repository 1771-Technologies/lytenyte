import type { Dispatch, SetStateAction } from "react";
import { createContext, useContext } from "react";
import type { Accordion } from "./accordion.js";

export interface AccordionItemContext {
  readonly collapsible: boolean;
  readonly hiddenUntilFound: boolean;
  readonly attrs: Record<string, string | boolean | undefined>;
  readonly state: Accordion.Item.State;
  readonly toggle: () => void;
  readonly triggerId: string;
  readonly setTriggerId: Dispatch<SetStateAction<string>>;
  readonly panelId: string;
  readonly setPanelId: Dispatch<SetStateAction<string>>;
  readonly onOpenChangeComplete?: (open: boolean) => void;
}

const context = createContext({} as AccordionItemContext);
export const AccordionItemProvider = context.Provider;
export const useAccordionItem = () => useContext(context);
