import { useId, useMemo, useState, type PropsWithChildren } from "react";
import { context } from "./context.js";
import { useControlled } from "@1771technologies/lytenyte-hooks-react";
import type { Placement, ReferenceElement } from "../../external/floating-ui.js";
import type { FocusTrapOptions } from "@1771technologies/lytenyte-shared";

export const DialogRoot = ({
  open: openProp,
  onOpenChange: onOpenChangeProp,
  openInitial,
  id: idProvided,
  descriptionId: descIdProvider,
  titleId: titleIdProvided,
  children,
  focusCanReturn,
  focusCanTrap,
  focusFallback,
  focusInitial,
  focusPreventScroll,
  focusReturn,
  focusTrap,
  lockScroll,
  lightDismiss,
  modal,

  anchor = null,
  placement = "bottom",
  shiftPadding = 8,
  inline = false,
  sideOffset = 8,
  alignOffset = 0,
}: PropsWithChildren<DialogRoot.Props>) => {
  const [open, onOpenChange] = useControlled({ controlled: openProp, default: openInitial });
  const [arrow, setArrow] = useState<HTMLElement | null>(null);

  const id = useId();
  const descriptionId = useId();
  const titleId = useId();

  const value = useMemo(() => {
    return {
      open,
      onOpenChange: (b: boolean) => {
        onOpenChange(b);
        onOpenChangeProp?.(b);
      },

      id: idProvided ?? id,
      descriptionId: descIdProvider ?? descriptionId,
      titleId: titleIdProvided ?? titleId,

      lightDismiss,
      focusCanReturn,
      focusCanTrap,
      focusFallback,
      focusInitial,
      focusPreventScroll,
      focusReturn,
      focusTrap,
      lockScroll,
      modal,

      anchor,
      placement,
      shiftPadding,
      inline,
      sideOffset,
      alignOffset,

      arrow,
      setArrow,
    };
  }, [
    alignOffset,
    anchor,
    arrow,
    descIdProvider,
    descriptionId,
    focusCanReturn,
    focusCanTrap,
    focusFallback,
    focusInitial,
    focusPreventScroll,
    focusReturn,
    focusTrap,
    id,
    idProvided,
    inline,
    lightDismiss,
    lockScroll,
    modal,
    onOpenChange,
    onOpenChangeProp,
    open,
    placement,
    shiftPadding,
    sideOffset,
    titleId,
    titleIdProvided,
  ]);

  return <context.Provider value={value}>{children}</context.Provider>;
};

export namespace DialogRoot {
  export interface Props {
    readonly open?: boolean;
    readonly openInitial?: boolean;
    readonly onOpenChange?: (open: boolean) => void;
    readonly id?: string;
    readonly titleId?: string;
    readonly descriptionId?: string;

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

    readonly anchor?: ReferenceElement | string | null;
    readonly placement?: Placement;
    readonly shiftPadding?: number;
    readonly inline?: boolean;
    readonly sideOffset?: number;
    readonly alignOffset?: number;
  }
}
