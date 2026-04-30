import { createContext, useContext } from "react";
import type { VirtualElement } from "../../external/floating-ui.js";
import type { CompletionItem } from "../types";

interface ContextPopover {
  readonly isOpen: boolean;
  readonly referenceElement: VirtualElement | null;
}

const context = createContext({} as ContextPopover);
export const CompletionPopoverProvider = context.Provider;
export const useCompletionPopover = () => useContext(context);

interface ContextList {
  readonly items: CompletionItem[];
  readonly loading: boolean;
  readonly selectedIndex: number;
  readonly onSelect: (item: CompletionItem) => void;
}

const contextList = createContext({} as ContextList);

export const CompletionListProvider = contextList.Provider;
export const useCompletionListContext = () => useContext(contextList);
