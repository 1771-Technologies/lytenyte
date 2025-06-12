import { createContext, useContext } from "react";

export const depthContext = createContext(0);

export const useDepth = () => useContext(depthContext);
