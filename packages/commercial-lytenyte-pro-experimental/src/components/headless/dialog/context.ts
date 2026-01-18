import { createContext, useContext, type Dispatch, type SetStateAction } from "react";
import type { Placement, ReferenceElement } from "../../external/floating-ui";
import type { FocusTrapOptions } from "@1771technologies/lytenyte-shared";

export interface DialogContext {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onOpenChangeComplete: (open: boolean) => void;

  readonly id: string;
  readonly titleId: string;
  readonly descriptionId: string;

  readonly hide?: boolean;
  readonly lockScroll?: boolean;
  readonly modal?: boolean;
  readonly lightDismiss?: boolean | ((el: HTMLElement) => boolean);

  readonly focusTrap?: boolean;
  readonly focusInitial?: FocusTrapOptions["initialFocus"];
  readonly focusReturn?: FocusTrapOptions["setReturnFocus"];
  readonly focusFallback?: FocusTrapOptions["fallbackFocus"];
  readonly focusCanReturn?: FocusTrapOptions["checkCanReturnFocus"];
  readonly focusCanTrap?: FocusTrapOptions["checkCanFocusTrap"];
  readonly focusPreventScroll?: FocusTrapOptions["preventScroll"];

  readonly anchor: ReferenceElement | string | null;
  readonly placement: Placement;
  readonly shiftPadding: number;
  readonly inline: boolean;
  readonly sideOffset: number;
  readonly alignOffset: number;

  readonly arrow: HTMLElement | null;
  readonly setArrow: Dispatch<SetStateAction<HTMLElement | null>>;
}

export const context = createContext<DialogContext>(null as unknown as DialogContext);

export const useDialogRoot = () => useContext(context);
