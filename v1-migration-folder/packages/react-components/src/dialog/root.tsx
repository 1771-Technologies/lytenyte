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
import { useManagedDialog } from "./use-managed-dialog";
import { context, useDialog, type DialogContext } from "./root.use-dialog";

export interface DialogRootProps {
  readonly open?: boolean;
  readonly onOpenChange?: (b: boolean) => void;
  readonly timeEnter?: number;
  readonly timeExit?: number;
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
  const onOpenChange = useEvent(p.onOpenChange ?? setLocalOpen);

  const openFn = useEvent((b?: SetStateAction<boolean>) => {
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

  const { shouldMount, ref, state } = useManagedDialog(open, onOpenChange, timeEnter, timeExit);

  useImperativeHandle(forwardedRef, () => ({ open: openFn }), [openFn]);

  const value = useMemo<DialogContext>(() => {
    return {
      childOpen,
      setChildOpen,

      descriptionId,
      setDescriptionId,
      titleId,
      setTitleId,

      shouldMount,
      dialogRef: ref,
      nestedCount,
      state,
      onOpenChange,
      open,
      timeEnter,
      timeExit,
    };
  }, [
    childOpen,
    descriptionId,
    nestedCount,
    onOpenChange,
    open,
    ref,
    shouldMount,
    state,
    timeEnter,
    timeExit,
    titleId,
  ]);

  return <context.Provider value={value}>{children}</context.Provider>;
});
