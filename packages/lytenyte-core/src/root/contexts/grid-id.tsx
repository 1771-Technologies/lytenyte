import { createContext, memo, useContext, useId, type PropsWithChildren } from "react";

const context = createContext("");

export const GridIdProvider = memo((props: PropsWithChildren<{ gridId: string | undefined }>) => {
  const id = useId();
  const gridId = props.gridId ?? id;

  return <context.Provider value={gridId}>{props.children}</context.Provider>;
});

export const useGridIdContext = () => useContext(context);
