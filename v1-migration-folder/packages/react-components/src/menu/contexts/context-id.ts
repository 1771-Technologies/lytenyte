import { createContext, useContext } from "react";

const idContext = createContext<string>(null as unknown as string);

export const MenuIdProvider = idContext.Provider;
export const useMenuId = () => useContext(idContext);

const groupIdContext = createContext<string>(null as any);

export const GroupIdProvider = groupIdContext.Provider;
export const useGroupId = () => useContext(groupIdContext);
