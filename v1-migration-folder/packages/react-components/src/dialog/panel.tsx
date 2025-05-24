import { forwardRef, type JSX } from "react";
import { useDialog } from "./root.use-dialog";
import { useForkRef } from "@1771technologies/lytenyte-react-hooks";

export const DialogPanel = forwardRef<HTMLDialogElement, JSX.IntrinsicElements["dialog"]>(
  function DialogPanel(props, forwarded) {
    const { state, dialogRef } = useDialog();
    const mergedRefs = useForkRef(forwarded, dialogRef);

    return <dialog {...props} data-dialog-state={state} ref={mergedRefs}></dialog>;
  },
);
