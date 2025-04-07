import { Dialog } from "@base-ui-components/react/dialog";
import { forwardRef } from "react";
import { useDialogClass } from "./use-dialog-class";

export const DialogBackdrop: typeof Dialog.Backdrop = forwardRef(function DialogBackdrop(
  { className, ...props },
  ref,
) {
  const cl = useDialogClass("lng1771-dialog__backdrop", className);

  return <Dialog.Backdrop {...props} ref={ref} className={cl} />;
});

export const DialogPopup: typeof Dialog.Popup = forwardRef(function DialogPopup(
  { className, ...props },
  ref,
) {
  const cl = useDialogClass("lng1771-dialog", className);

  return <Dialog.Popup {...props} ref={ref} className={cl} />;
});

export const DialogTitle: typeof Dialog.Title = forwardRef(function DialogTitle(
  { className, ...props },
  ref,
) {
  const cl = useDialogClass("lng1771-dialog__title", className);

  return <Dialog.Title {...props} ref={ref} className={cl} />;
});

export const DialogDescription: typeof Dialog.Description = forwardRef(function DialogDescription(
  { className, ...props },
  ref,
) {
  const cl = useDialogClass("lng1771-dialog__description", className);

  return <Dialog.Description {...props} ref={ref} className={cl} />;
});

export const DialogClose: typeof Dialog.Close = forwardRef(function DialogClose(
  { className, ...props },
  ref,
) {
  const cl = useDialogClass("lng1771-dialog__close", className);

  return <Dialog.Close {...props} ref={ref} className={cl} />;
});
