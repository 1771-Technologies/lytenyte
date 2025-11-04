import { useId, useMemo, type PropsWithChildren } from "react";
import { context } from "./context.js";
import { useControlled } from "../../hooks/use-controlled.js";
import type { FocusTrapOptions } from "@1771technologies/lytenyte-shared";

export interface RootProps {
  readonly open?: boolean;
  readonly openInitial?: boolean;
  readonly onOpenChange?: (open: boolean) => void;
  readonly id?: string;

  readonly lockScroll?: boolean;
  readonly lightDismiss?: boolean;
  readonly modal?: boolean;
  readonly focusTrap?: boolean;
  readonly focusInitial?: FocusTrapOptions["initialFocus"];
  readonly focusReturn?: FocusTrapOptions["setReturnFocus"];
  readonly focusFallback?: FocusTrapOptions["fallbackFocus"];
  readonly focusCanReturn?: FocusTrapOptions["checkCanReturnFocus"];
  readonly focusCanTrap?: FocusTrapOptions["checkCanFocusTrap"];
  readonly focusPreventScroll?: FocusTrapOptions["preventScroll"];
  readonly focusIsKeyForward?: FocusTrapOptions["isKeyForward"];
  readonly focusIsKeyBackward?: FocusTrapOptions["isKeyBackward"];
}

export const Root = ({
  open: openProp,
  onOpenChange: onOpenChangeProp,
  openInitial,
  id: idProvided,
  children,
  focusCanReturn,
  focusCanTrap,
  focusFallback,
  focusInitial,
  focusIsKeyBackward,
  focusIsKeyForward,
  focusPreventScroll,
  focusReturn,
  focusTrap,
  lockScroll,
  lightDismiss,
  modal,
}: PropsWithChildren<RootProps>) => {
  const [open, onOpenChange] = useControlled({ controlled: openProp, default: openInitial });

  const id = useId();

  const value = useMemo(() => {
    return {
      open,
      onOpenChange: (b: boolean) => {
        onOpenChange(b);
        onOpenChangeProp?.(b);
      },

      id: idProvided ?? id,

      lightDismiss,
      focusCanReturn,
      focusCanTrap,
      focusFallback,
      focusInitial,
      focusIsKeyBackward,
      focusIsKeyForward,
      focusPreventScroll,
      focusReturn,
      focusTrap,
      lockScroll,
      modal,
    };
  }, [
    focusCanReturn,
    focusCanTrap,
    focusFallback,
    focusInitial,
    focusIsKeyBackward,
    focusIsKeyForward,
    focusPreventScroll,
    focusReturn,
    focusTrap,
    id,
    idProvided,
    lightDismiss,
    lockScroll,
    modal,
    onOpenChange,
    onOpenChangeProp,
    open,
  ]);

  return <context.Provider value={value}>{children}</context.Provider>;
};
