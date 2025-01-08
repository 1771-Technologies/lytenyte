import { getPosition, type Dimensions, type Placement } from "@1771technologies/positioner";
import { useEffect, useState } from "react";
import type { PopoverTarget } from "./popover.js";
import type { ArrowSvgProps } from "./arrow-svgs.js";
import { DownArrow, UpArrow, RightArrow, LeftArrow } from "./arrow-svgs.js";
import { isHTMLElement } from "@1771technologies/js-utils";

/**
 * Props for the Arrow component.
 * @interface
 */
export interface ArrowProps {
  /** The placement of the arrow relative to its target (top, bottom, left, right, with start/end variations) */
  readonly placement: Placement;
  /** The target element or DOMRect that the arrow should point to */
  readonly popoverTarget: PopoverTarget;
  /** Distance in pixels between the arrow and its target */
  readonly offset: number;
  /** CSS color value for the arrow fill */
  readonly arrowColor: string;
}

/**
 * Renders an arrow that points to a target element or position.
 * The arrow is rendered in a portal and automatically positioned based on the target and placement.
 *
 * @component
 * @param props - The component props
 * @param props.placement - Determines which direction the arrow points and its position relative to the target
 * @param props.popoverTarget - The element or DOMRect that the arrow should point to
 * @param props.offset - Distance in pixels between the arrow and its target
 * @param props.arrowColor - CSS color value for the arrow fill
 *
 * @example
 * ```tsx
 * <Arrow
 *   placement="top"
 *   popoverTarget={document.getElementById('target')}
 *   offset={8}
 *   arrowColor="#000000"
 * />
 * ```
 */
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
  return (
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
    </div>
  );
}

/**
 * Maps placement values to arrow dimensions.
 * For horizontal placements (top/bottom), arrows are 16x8.
 * For vertical placements (left/right), arrows are 8x16.
 */
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

/**
 * Maps placement values to their corresponding arrow components.
 * The mapping ensures the arrow points in the correct direction based on its placement.
 */
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
