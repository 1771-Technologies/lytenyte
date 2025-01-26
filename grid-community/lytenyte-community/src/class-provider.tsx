import { createContext, useContext, type PropsWithChildren } from "react";

export interface CellClasses {
  readonly cellClasses: string;
}

const context = createContext<CellClasses>({ cellClasses: "" });

export function ClassProvider(props: PropsWithChildren<{ value: CellClasses }>) {
  return <context.Provider value={props.value}>{props.children}</context.Provider>;
}

export function useClassProvider() {
  return useContext(context);
}
