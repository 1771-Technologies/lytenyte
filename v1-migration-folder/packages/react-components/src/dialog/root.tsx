import {
  createContext,
  forwardRef,
  useImperativeHandle,
  useMemo,
  useState,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
} from "react";
import { useEvent } from "@1771technologies/lytenyte-react-hooks";
import { useManagedDialog } from "./use-managed-dialog";
import type { OpenState } from "./use-transition-effect";

export interface DialogRootProps {
  readonly open?: boolean;
  readonly onOpenChange?: (b: boolean) => void;
  readonly timeEnter?: number;
  readonly timeExit?: number;
}

export interface DialogApi {
  readonly open: (() => boolean) | ((b: SetStateAction<boolean>) => void);
}

export interface DialogContext {
  readonly open: boolean;
  readonly onOpenChange: (b: boolean) => void;
  readonly timeEnter: number;
  readonly timeExit: number;
  readonly dialogRef: Dispatch<SetStateAction<HTMLDialogElement | null>>;
  readonly state: OpenState;
  readonly shouldMount: boolean;
}

const context = createContext<DialogContext>({} as unknown as DialogContext);

export const Root = forwardRef<DialogApi, PropsWithChildren<DialogRootProps>>(function Root(
  { children, ...p },
  forwardedRef,
) {
  const [localOpen, setLocalOpen] = useState(false);

  const open = p.open ?? localOpen;
  const onOpenChange = useEvent(p.onOpenChange ?? setLocalOpen);

  const openFn = useEvent((b?: SetStateAction<boolean>) => {
    if (b == null) return open;

    if (typeof b === "function") onOpenChange(b(open));
    else onOpenChange(b);
  });

  const timeEnter = p.timeEnter ?? 0;
  const timeExit = p.timeExit ?? 0;

  const { shouldMount, ref, state } = useManagedDialog(open, onOpenChange, timeEnter, timeExit);

  useImperativeHandle(forwardedRef, () => ({ open: openFn }), [openFn]);

  const value = useMemo<DialogContext>(() => {
    return {
      shouldMount,
      dialogRef: ref,
      state,
      onOpenChange,
      open,
      timeEnter,
      timeExit,
    };
  }, [onOpenChange, open, ref, shouldMount, state, timeEnter, timeExit]);

  return <context.Provider value={value}>{children}</context.Provider>;
});
