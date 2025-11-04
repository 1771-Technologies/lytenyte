import { createContext, useContext, type Ref } from "react";
import type { Transitioned } from "../../hooks/use-transitioned-open.js";

interface SubItemContextValue {
  readonly ref: Ref<HTMLUListElement | null>;
  readonly submenu: HTMLElement | null;
  readonly transition: Transitioned;
  readonly root: HTMLLIElement | null;
}

export const subItemContext = createContext<SubItemContextValue | null>(null);

export const useSubItemContext = () => useContext(subItemContext);
