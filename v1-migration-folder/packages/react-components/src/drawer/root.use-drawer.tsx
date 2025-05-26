import { createContext, useContext, useMemo } from "react";
import { useDialog, type DialogContext } from "../dialog/root.use-dialog";

export interface DrawerContext {
  readonly side: "top" | "bottom" | "end" | "start";
  readonly swipeToClose: boolean;
  readonly offset:
    | number
    | [block: number, inline: number]
    | [top: number, end: number, bottom: number, start: number];
}

export const context = createContext<DrawerContext>(null as unknown as DrawerContext);

export const useDrawerContext = (): DrawerContext & DialogContext => {
  const dialog = useDialog();
  const drawer = useContext(context);

  return useMemo(() => {
    return { ...dialog, ...drawer };
  }, [dialog, drawer]);
};
