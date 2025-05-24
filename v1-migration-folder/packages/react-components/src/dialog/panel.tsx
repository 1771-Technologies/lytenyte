import { forwardRef, type CSSProperties, type JSX } from "react";
import { useDialog } from "./root.use-dialog";
import { useForkRef } from "@1771technologies/lytenyte-react-hooks";

export const DialogPanel = forwardRef<HTMLDialogElement, JSX.IntrinsicElements["dialog"]>(
  function DialogPanel(props, forwarded) {
    const { state, dialogRef, nestedCount, childOpen } = useDialog();
    const mergedRefs = useForkRef(forwarded, dialogRef);

    return (
      <dialog
        {...props}
        data-dialog-state={state}
        data-nested={nestedCount > 0}
        data-nested-dialog-open={childOpen}
        ref={mergedRefs}
        style={{ ...props.style, "--nested-dialogs": nestedCount } as CSSProperties}
      ></dialog>
    );
  },
);
