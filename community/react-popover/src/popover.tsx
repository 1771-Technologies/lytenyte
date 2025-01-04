import { isHTMLElement, IsoResizeObserver } from "@1771technologies/js-utils";
import type { Dimensions, Placement, Rect } from "@1771technologies/positioner";
import { getPosition } from "@1771technologies/positioner";
import { Dialog } from "@1771technologies/react-dialog";
import { refCompat, useCombinedRefs, useEvent, useIsoEffect } from "@1771technologies/react-utils";
import { useState, type JSX, type PropsWithChildren } from "react";
import { Arrow } from "./arrow";

/**
 * Represents the target element or position that the popover should be positioned relative to.
 * Can be an HTML element, a DOMRect, or null if no target is set.
 */
export type PopoverTarget = HTMLElement | Rect | null;

/**
 * Props for the Popover component.
 * @interface
 */
export interface PopoverProps {
  /** Element or position that the popover should be positioned relative to */
  readonly popoverTarget: PopoverTarget;
  /** Controls whether the popover is visible */
  readonly open: boolean;
  /** Callback fired when the open state changes */
  readonly onOpenChange: (b: boolean) => void;
  /** Where to place the popover relative to the target (default: "bottom") */
  readonly placement?: Placement;
  /** Distance in pixels between the popover and its target (default: 12) */
  readonly offset?: number;
  /** Whether to show an arrow pointing to the target */
  readonly arrow?: boolean;
  /** CSS color value for the arrow (default: "currentcolor") */
  readonly arrowColor?: string;
  /** Custom dimensions for the arrow */
  readonly arrowDimensions?: Dimensions;
}

/**
 * Internal implementation of the Popover component.
 * This component handles the positioning logic and arrow rendering.
 *
 * @internal
 */
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

  /**
   * Updates the popover's position relative to its target.
   * Calculates and applies the correct position based on the placement and offset.
   */
  const handlePosition = useEvent(() => {
    dialog!.style.display = "block";

    const floating = dialog!.getBoundingClientRect();
    const reference = isHTMLElement(popoverTarget!)
      ? popoverTarget.getBoundingClientRect()
      : popoverTarget!;

    const pos = getPosition({
      floating,
      reference,
      placement: placement ?? "bottom",
      offset: offset ?? 12,
    });

    dialog!.style.top = `${pos.y}px`;
    dialog!.style.left = `${pos.x}px`;

    dialog!.style.setProperty("--lng-reference-width", `${reference.width}px`);
    dialog!.style.setProperty("--lng-reference-height", `${reference.height}px`);

    if (arrow) setArrowP(pos.placement);
    else setArrowP(null);
  });

  useIsoEffect(() => {
    if (!dialog || !popoverTarget) return;

    const resizeObserver = new IsoResizeObserver(() => handlePosition());
    resizeObserver.observe(dialog);

    return () => resizeObserver.disconnect();
  }, [dialog, handlePosition, popoverTarget]);

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

/**
 * A floating popover component that positions itself relative to a target element.
 * Supports multiple placements, custom offsets, and an optional pointing arrow.
 *
 * @component
 * @example
 * ```tsx
 * <Popover
 *   popoverTarget={buttonRef.current}
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 *   placement="top"
 *   offset={8}
 *   arrow
 * >
 *   Popover content
 * </Popover>
 * ```
 */
export const Popover = refCompat(PopoverImpl, "Popover");
