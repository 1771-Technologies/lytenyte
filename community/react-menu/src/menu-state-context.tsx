import { createContext, useContext, type PropsWithChildren } from "react";

const state = createContext<any>({});

export function MenuStateProvider(props: PropsWithChildren<{ value: any }>) {
  return <state.Provider value={props.value}>{props.children}</state.Provider>;
}

export const useMenuState = () => useContext(state);
