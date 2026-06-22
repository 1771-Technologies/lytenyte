import { createContext, useContext, type ReactNode } from "react";

export interface OverlaySlots {
  readonly rowsTop?: ReactNode;
  readonly rowsCenter?: ReactNode;
  readonly rowsBottom?: ReactNode;
  readonly header?: ReactNode;
}

const EMPTY: OverlaySlots = {};

const context = createContext<OverlaySlots>(EMPTY);

export const OverlaySlotsProvider = context.Provider;
export const useOverlaySlots = () => useContext(context);
