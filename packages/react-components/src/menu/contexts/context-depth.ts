import { createContext, useContext } from "react";

const depthContext = createContext(0);

export const useDepth = () => useContext(depthContext);
export const DepthProvider = depthContext.Provider;
