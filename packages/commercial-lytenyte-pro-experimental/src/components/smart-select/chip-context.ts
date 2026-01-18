import { createContext, useContext, type RefObject } from "react";

const context = createContext(
  {} as {
    activeChip: string | null;
    setActiveChip: (s: string | null) => void;
    inputRef: RefObject<HTMLElement | null>;
  },
);

export const ChipContextProvider = context.Provider;
export const useChipContext = () => useContext(context);
