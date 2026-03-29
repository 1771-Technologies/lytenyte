import { createContext, memo, useContext, useMemo, type PropsWithChildren } from "react";
import type { GridEvents } from "../../types/events.js";

const context = createContext<GridEvents>(null as any);

export const GridEventsProvider = memo((props: PropsWithChildren<{ events: GridEvents | undefined }>) => {
  const value = useMemo(() => {
    return props.events ?? {};
  }, [props.events]);
  return <context.Provider value={value}>{props.children}</context.Provider>;
});

export const useGridEvents = () => useContext(context);
