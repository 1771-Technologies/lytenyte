import { forwardRef, type JSX } from "react";
import { DialogPanel } from "../dialog/panel";
import { useDrawerContext } from "./root.use-drawer";

export const DrawerPanel = forwardRef<HTMLDialogElement, JSX.IntrinsicElements["dialog"]>(
  function DrawerPanel(props, forwarded) {
    const { side } = useDrawerContext();

    return <DialogPanel {...props} data-ln-drawer-side={side} ref={forwarded} />;
  },
);
