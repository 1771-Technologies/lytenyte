import { createContext, useContext, useRef, type PropsWithChildren, type RefObject } from "react";

const context = createContext(null as unknown as RefObject<number | null>);

export function SelectPivotProvider(props: PropsWithChildren) {
  const selectPivot = useRef<number | null>(null);

  return <context.Provider value={selectPivot}>{props.children}</context.Provider>;
}

export const useSelectPivotRef = () => useContext(context);
