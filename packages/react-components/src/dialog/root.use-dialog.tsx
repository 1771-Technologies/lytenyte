import { createContext, useContext, type Dispatch, type SetStateAction } from "react";
import type { OpenState } from "./use-transition-effect.js";

export interface DialogContext {
  readonly open: boolean;
  readonly onOpenChange: (b: boolean) => void;

  readonly parent: DialogContext | null;

  readonly alert: boolean;
  readonly modal: boolean;
  readonly dismissible: boolean;
  readonly dismissPropagates: boolean;
  readonly lockBodyScroll: boolean;
  readonly trapFocus: boolean;

  readonly childOpen: boolean;
  readonly setChildOpen: Dispatch<SetStateAction<boolean>>;

  readonly descriptionId: string | undefined;
  readonly setDescriptionId: Dispatch<SetStateAction<string | undefined>>;

  readonly titleId: string | undefined;
  readonly setTitleId: Dispatch<SetStateAction<string | undefined>>;

  readonly nestedCount: number;
  readonly timeEnter: number;
  readonly timeExit: number;
  readonly dialog: HTMLDialogElement | null;
  readonly dialogRef: Dispatch<SetStateAction<HTMLDialogElement | null>>;
  readonly state: OpenState;
  readonly shouldMount: boolean;
  readonly triggerRef: Dispatch<SetStateAction<HTMLElement | null>>;
  readonly trigger: HTMLElement | null;
}

export const context = createContext<DialogContext>(null as unknown as DialogContext);

export const useDialog = () => useContext(context);
