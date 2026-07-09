import { createContext, useContext, type RefObject } from "react";

export interface DialogContextValue {
  readonly open: boolean;
  readonly modal: boolean;
  readonly dismissible: boolean;
  readonly closeOnEscape: boolean;
  readonly titleId: string;
  readonly setTitleId: (id: string) => void;
  readonly descriptionId: string | undefined;
  readonly setDescriptionId: (id: string) => void;
  readonly triggerRef: RefObject<HTMLElement | null>;
  readonly onOpenChange: (open: boolean) => void;
}

const context = createContext({} as DialogContextValue);

export const DialogRootProvider = context.Provider;
export const useDialogRoot = () => useContext(context);
