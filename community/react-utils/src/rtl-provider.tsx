import { createContext, useContext, type PropsWithChildren } from "react";

const context = createContext(false);

export function RtlProvider(props: PropsWithChildren<{ value: boolean }>) {
  return <context.Provider value={props.value}>{props.children}</context.Provider>;
}

export const useIsRtl = () => useContext(context);
