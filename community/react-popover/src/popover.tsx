import { isHTMLElement } from "@1771technologies/js-utils";
import type { Dimensions, OffsetValue, Placement, Rect } from "@1771technologies/positioner";
import { getPosition } from "@1771technologies/positioner";
import { Dialog } from "@1771technologies/react-dialog";
import { refCompat, useCombinedRefs, useIsoEffect } from "@1771technologies/react-utils";
import { useState, type JSX, type PropsWithChildren } from "react";
import { DownArrow, LeftArrow, RightArrow, UpArrow, type ArrowProps } from "./arrow";

export type PopoverTarget = HTMLElement | Rect | null;

export interface PopoverProps {
  readonly popoverTarget: PopoverTarget;
  readonly open: boolean;
  readonly onOpenChange: (b: boolean) => void;
  readonly placement?: Placement;
  readonly offset?: OffsetValue;
  readonly arrow?: boolean;
  readonly arrowColor?: string;
  readonly arrowDimensions?: Dimensions;
}

const arrowDimensions = { width: 16, height: 8 };
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
  const [arrowEl, setArrowEl] = useState<HTMLDivElement | null>(null);
  const [arrowPlacement, setArrowPlacement] = useState<Placement | null>();

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
      arrow: arrow ? arrowDimensions : undefined,
    });
    dialog.style.top = `${pos.y}px`;
    dialog.style.left = `${pos.x}px`;

    if (arrowEl) {
      setArrowPlacement(pos.arrow.arrowPlacement);
      arrowEl.style.top = `1px`;
      arrowEl.style.left = `calc(100% - 1px)`;
    } else {
      setArrowPlacement(null);
    }
  }, [arrow, arrowEl, dialog, offset, placement, popoverTarget]);

  const combinedRef = useCombinedRefs(ref, setDialog);

  if (!popoverTarget) return null;

  const Arrow = arrowPlacement ? placeToArrow[arrowPlacement] : null;
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      ref={combinedRef}
      {...props}
      style={{ margin: 0, display: "none", overflow: "visible", ...props.style }}
    >
      {children}
      {arrow && (
        <div
          ref={setArrowEl}
          style={{
            position: "absolute",
            ...arrowDimensions,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {Arrow && <Arrow fill={arrowColor} />}
        </div>
      )}
    </Dialog>
  );
}

const placeToArrow: Record<Placement, React.FC<ArrowProps>> = {
  "bottom-end": DownArrow,
  bottom: DownArrow,
  "bottom-start": DownArrow,

  "top-end": UpArrow,
  top: UpArrow,
  "top-start": UpArrow,

  "left-end": RightArrow,
  left: RightArrow,
  "left-start": RightArrow,

  "right-end": LeftArrow,
  right: LeftArrow,
  "right-start": LeftArrow,
};

export const Popover = refCompat(PopoverImpl, "Popover");
