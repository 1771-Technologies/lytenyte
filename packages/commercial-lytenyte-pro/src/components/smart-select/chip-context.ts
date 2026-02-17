import { createContext, useContext } from "react";

const context = createContext(
  {} as {
    activeChip: string | null;
    setActiveChip: (s: string | null) => void;
  },
);

export const ChipContextProvider = context.Provider;
export const useChipContext = () => useContext(context);
