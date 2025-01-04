import { getPosition, type Dimensions, type Placement } from "@1771technologies/positioner";
import { useEffect, useState } from "react";
import type { PopoverTarget } from "./popover";
import type { ArrowSvgProps } from "./arrow-svgs";
import { DownArrow, UpArrow, RightArrow, LeftArrow } from "./arrow-svgs";
import { createPortal } from "react-dom";
import { isHTMLElement } from "@1771technologies/js-utils";

export interface ArrowProps {
  readonly placement: Placement;
  readonly popoverTarget: PopoverTarget;
  readonly offset: number;

  readonly arrowColor: string;
}

export function Arrow({ placement, popoverTarget, offset, arrowColor }: ArrowProps) {
  const [aRef, setARef] = useState<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!aRef) return;

    const reference = isHTMLElement(popoverTarget!)
      ? popoverTarget!.getBoundingClientRect()
      : popoverTarget!;

    const dims = placementToDimensions[placement];

    const offsetDim =
      placement.includes("left") || placement.includes("right") ? "width" : "height";

    const pos = getPosition({
      reference,
      floating: placementToDimensions[placement],
      placement,
      offset: offset - dims[offsetDim],
    });

    aRef.style.top = `${pos.y}px`;
    aRef.style.left = `${pos.x}px`;
  }, [aRef, offset, placement, popoverTarget]);

  const El = placeToArrow[placement];
  return createPortal(
    <div
      ref={setARef}
      style={{
        position: "fixed",
        display: "flex",
        alignItems: "center",
        width: "fit-content",
        height: "fit-content",
      }}
    >
      <El fill={arrowColor} />
    </div>,
    document.body,
  );
}

const placementToDimensions: Record<Placement, Dimensions> = {
  "bottom-end": { width: 16, height: 8 },
  bottom: { width: 16, height: 8 },
  "bottom-start": { width: 16, height: 8 },

  "top-end": { width: 16, height: 8 },
  top: { width: 16, height: 8 },
  "top-start": { width: 16, height: 8 },

  "left-end": { width: 8, height: 16 },
  left: { width: 8, height: 16 },
  "left-start": { width: 8, height: 16 },

  "right-end": { width: 8, height: 16 },
  right: { width: 8, height: 16 },
  "right-start": { width: 8, height: 16 },
};

const placeToArrow: Record<Placement, React.FC<ArrowSvgProps>> = {
  "bottom-end": UpArrow,
  bottom: UpArrow,
  "bottom-start": UpArrow,

  "top-end": DownArrow,
  top: DownArrow,
  "top-start": DownArrow,

  "right-end": RightArrow,
  right: RightArrow,
  "right-start": RightArrow,

  "left-end": LeftArrow,
  left: LeftArrow,
  "left-start": LeftArrow,
};
