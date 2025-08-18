import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
  type PropsWithChildren,
  type SetStateAction,
} from "react";
import { useEvent } from "@1771technologies/lytenyte-react-hooks";
import { useManagedDialog } from "./use-managed-dialog.js";
import { context, useDialog, type DialogContext } from "./root.use-dialog.js";

export interface DialogRootProps {
  readonly open?: boolean;
  readonly onOpenChange?: (b: boolean) => void;
  readonly timeEnter?: number;
  readonly timeExit?: number;

  readonly alert?: boolean;
  readonly modal?: boolean;
  readonly dismissible?: boolean;
  readonly dismissPropagates?: boolean;
  readonly lockBodyScroll?: boolean;
  readonly trapFocus?: boolean;

  readonly initialFocus?: string | ((dialog: HTMLDialogElement) => HTMLElement | null);
  readonly returnFocus?: string | (() => HTMLElement | null);
}

export interface DialogApi {
  readonly open: (() => boolean) | ((b: SetStateAction<boolean>) => void);
}

export const DialogRoot = forwardRef<DialogApi, PropsWithChildren<DialogRootProps>>(function Root(
  { children, ...p },
  forwardedRef,
) {
  const [childOpen, setChildOpen] = useState(false);
  // If useDialog is not null, then this dialog must be nested inside another dialog in the React tree.
  const parentDialog = useDialog();

  const nestedCount = (parentDialog?.nestedCount ?? -1) + 1;

  const [localOpen, setLocalOpen] = useState(false);

  const open = p.open ?? localOpen;
  const onOpenChange = p.onOpenChange ?? setLocalOpen;

  const openFn = useEvent((b?: SetStateAction<boolean>) => {
    /* v8 ignore next 4 */
    if (b == null) return open;

    if (typeof b === "function") onOpenChange(b(open));
    else onOpenChange(b);
  });

  const [descriptionId, setDescriptionId] = useState<string>();
  const [titleId, setTitleId] = useState<string>();

  useEffect(() => {
    if (!parentDialog) return;

    if (open) parentDialog.setChildOpen(true);
    else parentDialog.setChildOpen(false);

    return () => parentDialog.setChildOpen(open);
  }, [open, parentDialog]);

  const timeEnter = p.timeEnter ?? 0;
  const timeExit = p.timeExit ?? 0;

  const modal = p.modal ?? true;
  // If the dialog is a modal, we must trap the focus. This is an accessibility requirement.
  // We are also leveraging the <dialog/> which will trap focus if opened as a modal.
  /* v8 ignore next 1 */
  const trapFocus = modal || (p.trapFocus ?? true);

  const lockBodyScroll = p.lockBodyScroll ?? true;

  const alert = p.alert ?? false;
  const dismissible = alert ? false : (p.dismissible ?? true);

  useEffect(() => {
    if (modal && p.trapFocus === false) {
      console.error(
        "A modal dialog will always trap focus. Setting `trapFocus` to false has no impact. If you do not want to trap focus, set `modal` to false as well.",
      );
    }
    if (alert && p.dismissible === true) {
      console.error(
        "An Alert Dialog will never be dismissible. Alert dialogs by definition require user input to proceed. Use or a normal dialog or set dismissible to false.",
      );
    }
  }, [alert, modal, p.dismissible, p.trapFocus]);

  const { shouldMount, dialog, ref, state } = useManagedDialog(
    open,
    onOpenChange,
    timeEnter,
    timeExit,
    modal,
    trapFocus,
    lockBodyScroll,
    dismissible,
    p.dismissPropagates ?? false,
    p.initialFocus,
    p.returnFocus,
    parentDialog,
  );

  useImperativeHandle(forwardedRef, () => ({ open: openFn }), [openFn]);

  const [trigger, triggerRef] = useState<HTMLElement | null>(null);
  const value = useMemo<DialogContext>(() => {
    return {
      childOpen,
      setChildOpen,

      parent: parentDialog,

      descriptionId,
      setDescriptionId,
      titleId,
      setTitleId,

      alert,
      modal,
      trapFocus,
      lockBodyScroll,
      dismissible,
      dismissPropagates: p.dismissPropagates ?? false,

      shouldMount,
      dialog,
      dialogRef: ref,
      nestedCount,
      state,
      onOpenChange: (b) => {
        onOpenChange(b);
      },
      open,
      timeEnter,
      timeExit,
      trigger,
      triggerRef,
    };
  }, [
    alert,
    childOpen,
    descriptionId,
    dialog,
    dismissible,
    lockBodyScroll,
    modal,
    nestedCount,
    onOpenChange,
    open,
    p.dismissPropagates,
    parentDialog,
    ref,
    shouldMount,
    state,
    timeEnter,
    timeExit,
    titleId,
    trapFocus,
    trigger,
  ]);

  return <context.Provider value={value}>{children}</context.Provider>;
});
