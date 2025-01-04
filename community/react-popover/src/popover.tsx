import { isHTMLElement } from "@1771technologies/js-utils";
import type { Dimensions, Placement, Rect } from "@1771technologies/positioner";
import { getPosition } from "@1771technologies/positioner";
import { Dialog } from "@1771technologies/react-dialog";
import { refCompat, useCombinedRefs, useIsoEffect } from "@1771technologies/react-utils";
import { useState, type JSX, type PropsWithChildren } from "react";
import { Arrow } from "./arrow";

export type PopoverTarget = HTMLElement | Rect | null;

export interface PopoverProps {
  readonly popoverTarget: PopoverTarget;
  readonly open: boolean;
  readonly onOpenChange: (b: boolean) => void;
  readonly placement?: Placement;
  readonly offset?: number;
  readonly arrow?: boolean;
  readonly arrowColor?: string;
  readonly arrowDimensions?: Dimensions;
}

function PopoverImpl({
  popoverTarget,
  placement,
  offset,
  arrow,
  arrowColor = "currentcolor",
  onOpenChange,
  open,

  ref,
  children,
  ...props
}: PropsWithChildren<PopoverProps> & Omit<JSX.IntrinsicElements["dialog"], "popoverTarget">) {
  const [dialog, setDialog] = useState<HTMLDialogElement | null>(null);
  const [arrowP, setArrowP] = useState<Placement | null>(null);

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
      offset: offset ?? 12,
    });

    dialog.style.top = `${pos.y}px`;
    dialog.style.left = `${pos.x}px`;

    if (arrow) setArrowP(pos.placement);
    else setArrowP(null);
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
      {arrowP && (
        <Arrow
          placement={arrowP}
          popoverTarget={popoverTarget}
          offset={offset ?? 12}
          arrowColor={arrowColor}
        />
      )}
    </Dialog>
  );
}

export const Popover = refCompat(PopoverImpl, "Popover");
