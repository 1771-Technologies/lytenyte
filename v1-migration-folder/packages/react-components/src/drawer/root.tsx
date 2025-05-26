import { forwardRef, useMemo, type PropsWithChildren } from "react";
import { DialogRoot, type DialogApi, type DialogRootProps } from "../dialog/root";
import { context } from "./root.use-drawer";

export interface DrawerRootProps extends DialogRootProps {
  readonly side?: "top" | "bottom" | "start" | "end";
  readonly swipeToClose?: boolean;
  readonly offset?:
    | number
    | [block: number, inline: number]
    | [top: number, end: number, bottom: number, start: number];
}

export const DrawerRoot = forwardRef<DialogApi, PropsWithChildren<DrawerRootProps>>(
  function DrawerRoot(
    { side = "start", swipeToClose = true, offset = 0, children, ...props },
    forwarded,
  ) {
    const value = useMemo(() => {
      return { side, swipeToClose, offset };
    }, [offset, side, swipeToClose]);

    return (
      <DialogRoot {...props} ref={forwarded}>
        <context.Provider value={value}>{children}</context.Provider>
      </DialogRoot>
    );
  },
);
