import { useSlot, type SlotComponent } from "@1771technologies/lytenyte-react-hooks";
import type { OpenState } from "./use-transition-effect.js";
import { forwardRef, type JSX } from "react";
import { useDialog } from "./root.use-dialog.js";

export interface DialogCloseProps {
  readonly as?: SlotComponent<OpenState>;
}

export const DialogClose = forwardRef<
  HTMLButtonElement,
  JSX.IntrinsicElements["button"] & DialogCloseProps
>(function DialogClose({ as, ...props }, forwarded) {
  const { state, onOpenChange } = useDialog();

  const render = useSlot({
    props: [
      {
        // Only pass the button type if the slot isn't provided, otherwise we may end
        // up passing an invalid property to an element that does not accept it.
        type: as ? undefined : "button",
        onClick: () => {
          onOpenChange(false);
        },
      },

      props,
    ],
    ref: forwarded,
    slot: as ?? <button />,
    state,
  });

  return render;
});
