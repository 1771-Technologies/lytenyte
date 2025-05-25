import { forwardRef, useMemo, type PropsWithChildren } from "react";
import { DialogRoot, type DialogApi, type DialogRootProps } from "../dialog/root";
import { context } from "./root.use-drawer";

export interface DrawerRootProps extends DialogRootProps {
  readonly side?: "top" | "bottom" | "start" | "end";
  readonly swipeToClose?: boolean;
}

export const DrawerRoot = forwardRef<DialogApi, PropsWithChildren<DrawerRootProps>>(
  function DrawerRoot({ side, swipeToClose, children, ...props }, forwarded) {
    const value = useMemo(() => {
      return { side: side ?? "start", swipeToClose: swipeToClose ?? true };
    }, [side, swipeToClose]);

    return (
      <DialogRoot {...props} ref={forwarded}>
        <context.Provider value={value}>{children}</context.Provider>
      </DialogRoot>
    );
  },
);
