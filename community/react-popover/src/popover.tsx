import { containsElement, isHTMLElement } from "@1771technologies/js-utils";
import type { Dimensions, OffsetValue, Placement, Rect } from "@1771technologies/positioner";
import { getPosition } from "@1771technologies/positioner";
import { Dialog } from "@1771technologies/react-dialog";
import { refCompat, useCombinedRefs, useIsoEffect } from "@1771technologies/react-utils";
import { useState, type JSX, type PropsWithChildren } from "react";

export interface PopoverProps {
  readonly popoverTarget?: HTMLElement | Rect | null;
  readonly open: boolean;
  readonly onOpenChange: (b: boolean) => void;
  readonly placement?: Placement;
  readonly offset?: OffsetValue;
  readonly arrow?: Dimensions;
}

function PopoverImpl({
  open,
  onOpenChange,
  popoverTarget,
  placement,
  offset,
  arrow,

  ref,
  children,
  ...props
}: PropsWithChildren<PopoverProps> & JSX.IntrinsicElements["dialog"]) {
  const [dialog, setDialog] = useState<HTMLDialogElement | null>(null);

  useIsoEffect(() => {
    if (!dialog || !popoverTarget) return;

    const floating = dialog.getBoundingClientRect();
    const reference = isHTMLElement(popoverTarget)
      ? popoverTarget.getBoundingClientRect()
      : popoverTarget;

    const pos = getPosition({
      floating,
      reference,
      placement: placement ?? "bottom",
      arrow,
      offset,
    });
  }, [dialog]);

  const combinedRef = useCombinedRefs(ref, setDialog);

  if (!popoverTarget) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange} ref={combinedRef} {...props}>
      {children}
    </Dialog>
  );
}

export const Popover = refCompat(PopoverImpl, "Popover");
