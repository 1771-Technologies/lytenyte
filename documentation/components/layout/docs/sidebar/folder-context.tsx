"use client";

import { createContext, useContext } from "react";

export const FolderContext = createContext<{
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
} | null>(null);

export function useFolderContext() {
  const ctx = useContext(FolderContext);
  if (!ctx) throw new Error("Missing sidebar folder");

  return ctx;
}
