import { createContext, memo, useContext, useMemo, type PropsWithChildren } from "react";
import type { Grid } from "../../index.js";

const context = createContext<Grid.Events>(null as any);

export const GridEventsProvider = memo((props: PropsWithChildren<{ events: Grid.Events | undefined }>) => {
  const value = useMemo(() => {
    return props.events ?? {};
  }, [props.events]);
  return <context.Provider value={value}>{props.children}</context.Provider>;
});

export const useGridEvents = () => useContext(context);
