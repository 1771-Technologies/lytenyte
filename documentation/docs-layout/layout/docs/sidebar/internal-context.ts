"use client";

import { createContext, useContext } from "react";

export interface InternalContext {
  defaultOpenLevel: number;
  prefetch: boolean;
  level: number;
}

export const Context = createContext<InternalContext | null>(null);

export const useInternalContext = () => useContext(Context)!;
