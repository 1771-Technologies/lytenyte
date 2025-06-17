import { createContext, useContext, type Dispatch, type SetStateAction } from "react";

interface SubmenuContext {
  readonly trigger: HTMLElement | null;
  readonly setTrigger: Dispatch<SetStateAction<HTMLElement | null>>;
}

const context = createContext<SubmenuContext>(null as any);

export const SubmenuProvider = context.Provider;
export const useSubmenu = () => useContext(context);
