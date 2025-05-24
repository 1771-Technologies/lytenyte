import { createContext, useContext, type Dispatch, type SetStateAction } from "react";
import type { OpenState } from "./use-transition-effect";

export interface DialogContext {
  readonly open: boolean;
  readonly onOpenChange: (b: boolean) => void;

  readonly childOpen: boolean;
  readonly setChildOpen: Dispatch<SetStateAction<boolean>>;

  readonly descriptionId: string | undefined;
  readonly setDescriptionId: Dispatch<SetStateAction<string | undefined>>;

  readonly titleId: string | undefined;
  readonly setTitleId: Dispatch<SetStateAction<string | undefined>>;

  readonly nestedCount: number;
  readonly timeEnter: number;
  readonly timeExit: number;
  readonly dialogRef: Dispatch<SetStateAction<HTMLDialogElement | null>>;
  readonly state: OpenState;
  readonly shouldMount: boolean;
}

export const context = createContext<DialogContext>(null as unknown as DialogContext);

export const useDialog = () => useContext(context);
