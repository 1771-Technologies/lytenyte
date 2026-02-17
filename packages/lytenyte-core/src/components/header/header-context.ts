import type { LayoutHeader } from "@1771technologies/lytenyte-shared";
import { createContext, useContext, type Dispatch, type SetStateAction } from "react";

export interface HeaderContextType {
  readonly activeHeaderDrag: LayoutHeader | null;
  readonly setActiveHeaderDrag: Dispatch<SetStateAction<LayoutHeader | null>>;
}

const context = createContext<HeaderContextType>({} as any);
export const HeaderProvider = context.Provider;
export const useHeader = () => useContext(context);
