import { useId, useMemo, useState, type PropsWithChildren } from "react";
import { context } from "./context.js";
import type { Placement, ReferenceElement } from "../../external/floating-ui.js";
import type { FocusTrapOptions } from "@1771technologies/lytenyte-shared";
import { useControlled } from "@1771technologies/lytenyte-core/internal";

export const DialogRoot = ({
  open: openProp,
  onOpenChange: onOpenChangeProp,
  onOpenChangeComplete,
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
  lightDismiss,
  modal,
  hide,

  lockScroll = modal ?? true,
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
      onOpenChangeComplete: (b: boolean) => {
        onOpenChangeComplete?.(b);
      },

      id: idProvided ?? id,
      descriptionId: descIdProvider ?? descriptionId,
      titleId: titleIdProvided ?? titleId,

      hide,

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
    hide,
    id,
    idProvided,
    inline,
    lightDismiss,
    lockScroll,
    modal,
    onOpenChange,
    onOpenChangeComplete,
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
    readonly onOpenChangeComplete?: (open: boolean) => void;
    readonly id?: string;
    readonly titleId?: string;
    readonly descriptionId?: string;

    readonly hide?: boolean;

    readonly lockScroll?: boolean;
    readonly lightDismiss?: boolean | ((el: HTMLElement) => boolean);
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
