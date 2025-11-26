import { createContext, useContext, type Dispatch, type SetStateAction } from "react";

interface ComboContext {
  readonly menu: HTMLDivElement | null;
  readonly activeEl: HTMLDivElement | null;
  readonly setActiveEl: Dispatch<SetStateAction<HTMLDivElement | null>>;
}

export const comboContext = createContext(null as unknown as ComboContext);

export const useComboContext = () => useContext(comboContext);
