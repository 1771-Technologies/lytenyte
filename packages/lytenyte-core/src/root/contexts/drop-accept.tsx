import { createContext, memo, useContext, useMemo, type PropsWithChildren } from "react";
import { useGridIdContext } from "./grid-id.js";

const context = createContext([] as string[]);

export const DropAcceptProvider = memo(
  (props: PropsWithChildren<{ rowDropAccept: string[] | undefined }>) => {
    const gridId = useGridIdContext();

    const dropAccept = useMemo(() => {
      const drop = props.rowDropAccept ?? [];
      if (!drop.includes(gridId)) drop.push(gridId);

      return drop.map((x) => `grid:${x}`);
    }, [gridId, props.rowDropAccept]);

    return <context.Provider value={dropAccept}>{props.children}</context.Provider>;
  },
);

export const useDropAcceptContext = () => useContext(context);
