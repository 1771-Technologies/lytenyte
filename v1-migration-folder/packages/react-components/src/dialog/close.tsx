import { useSlot, type SlotComponent } from "@1771technologies/lytenyte-react-hooks";
import type { OpenState } from "./use-transition-effect";
import { forwardRef, type JSX } from "react";
import { useDialog } from "./root.use-dialog";

export interface DialogCloseProps {
  readonly slot?: SlotComponent<OpenState>;
}

export const DialogClose = forwardRef<
  HTMLButtonElement,
  JSX.IntrinsicElements["button"] & DialogCloseProps
>(function DialogClose({ slot, ...props }, forwarded) {
  const { state, onOpenChange } = useDialog();

  const render = useSlot({
    props: [
      {
        type: "button",
        onClick: () => {
          onOpenChange(false);
        },
      },
      props,
    ],
    ref: forwarded,
    slot: slot ?? <button />,
    state,
  });

  return render;
});
