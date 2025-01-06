import { createContext, useContext, type PropsWithChildren } from "react";
import type { MenuProps } from "./menu-root";

const context = createContext<MenuProps["classes"]>({ base: "" });

export function MenuClassProvider(props: PropsWithChildren<{ value: MenuProps["classes"] }>) {
  return <context.Provider value={props.value}>{props.children}</context.Provider>;
}

export const useClasses = () => useContext(context);
