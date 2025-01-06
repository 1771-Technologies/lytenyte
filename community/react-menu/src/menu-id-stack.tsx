import { createContext, useContext, useMemo, type PropsWithChildren } from "react";

const menuId = createContext<string[]>([]);

export const MenuIdProvider = (props: PropsWithChildren<{ value: string }>) => {
  const ids = useContext(menuId);
  const next = useMemo(() => [...ids, props.value], [ids, props.value]);

  return <menuId.Provider value={next}>{props.children}</menuId.Provider>;
};

export const useIdStack = () => useContext(menuId);
