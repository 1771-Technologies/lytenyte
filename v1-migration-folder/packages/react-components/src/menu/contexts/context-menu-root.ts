import { createContext, useContext, type Dispatch, type SetStateAction } from "react";

export interface MenuContext {
  readonly activeParent: HTMLElement | null;
  readonly setActiveParent: Dispatch<SetStateAction<HTMLElement | null>>;

  readonly activeIds: string[];
  readonly setActiveIds: Dispatch<SetStateAction<string[]>>;

  readonly timeEnter: number;
  readonly timeExit: number;

  readonly hoverOpenDelay: number;
}

export const context = createContext<MenuContext>(null as any);

export const useMenuRoot = () => useContext(context);
