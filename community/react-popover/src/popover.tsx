import { isHTMLElement } from "@1771technologies/js-utils";
import type { Dimensions, OffsetValue, Placement, Rect } from "@1771technologies/positioner";
import { getPosition } from "@1771technologies/positioner";
import { Dialog } from "@1771technologies/react-dialog";
import { refCompat, useCombinedRefs, useIsoEffect } from "@1771technologies/react-utils";
import { useState, type JSX, type PropsWithChildren } from "react";

export type PopoverTarget = HTMLElement | Rect | null;

export interface PopoverProps {
  readonly popoverTarget: PopoverTarget;
  readonly open: boolean;
  readonly onOpenChange: (b: boolean) => void;
  readonly placement?: Placement;
  readonly offset?: OffsetValue;
  readonly arrow?: Dimensions;
}

function PopoverImpl({
  popoverTarget,
  placement,
  offset,
  arrow,
  onOpenChange,
  open,

  ref,
  children,
  ...props
}: PropsWithChildren<PopoverProps> & Omit<JSX.IntrinsicElements["dialog"], "popoverTarget">) {
  const [dialog, setDialog] = useState<HTMLDialogElement | null>(null);

  useIsoEffect(() => {
    if (!dialog || !popoverTarget) return;

    dialog.style.display = "block";

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

    dialog.style.top = `${pos.y}px`;
    dialog.style.left = `${pos.x}px`;
  }, [arrow, dialog, offset, placement, popoverTarget]);

  const combinedRef = useCombinedRefs(ref, setDialog);

  if (!popoverTarget) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      ref={combinedRef}
      {...props}
      style={{ margin: 0, display: "none", ...props.style }}
    >
      {children}
    </Dialog>
  );
}

export const Popover = refCompat(PopoverImpl, "Popover");
