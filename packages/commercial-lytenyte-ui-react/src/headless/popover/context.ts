import type { Dispatch, SetStateAction } from "react";
import { createContext, useContext } from "react";

export interface PopoverContext {
  readonly setTrigger: Dispatch<SetStateAction<HTMLElement | null>>;
}

export const PopoverContext = createContext<PopoverContext>(null as unknown as PopoverContext);
export const usePopoverContext = () => useContext(PopoverContext);
