import { forwardRef, useContext, type ComponentProps, type JSX } from "react";
import { Dialog } from "../dialog/dialog.js";
import { idContext } from "./root/id-context.js";

function MenuTriggerImpl(
  props: ComponentProps<typeof Dialog.Trigger>,
  ref: JSX.IntrinsicElements["button"]["ref"],
) {
  const id = useContext(idContext);

  return <Dialog.Trigger id={id} {...props} ref={ref} />;
}

export const MenuTrigger = forwardRef(MenuTriggerImpl);
