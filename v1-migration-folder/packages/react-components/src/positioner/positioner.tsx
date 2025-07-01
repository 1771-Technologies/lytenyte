import { useState, type ReactElement } from "react";
import { usePositioner, type UsePositioner } from "./use-positioner.js";
import { useEvent, useSlot } from "@1771technologies/lytenyte-react-hooks";

export type PositionerProps = Omit<UsePositioner, "floating"> & {
  children: ReactElement;
};

export function Positioner({
  children,

  anchor,
  side,
  align,
  keepInView,
  shiftPadding,
  arrow,
  arrowOffset,
  inline,
  sideOffset,
  alignOffset,
  openStartDuration,
  active = true,
  rootBoundary,

  ...props
}: PositionerProps) {
  const [floating, setFloating] = useState<HTMLElement | null>(null);

  const internalRef = useEvent((el: HTMLElement | null) => {
    setFloating(el);
    if (!el) return;

    el.style.position = "fixed";
    el.style.display = "none";
  });

  usePositioner({
    floating,
    anchor,
    side,
    align,
    keepInView,
    shiftPadding,
    arrow,
    arrowOffset,
    inline,
    sideOffset,
    alignOffset,
    openStartDuration,
    active,
    rootBoundary,
  });

  const slot = useSlot({
    props: props,
    ref: internalRef,
    slot: children,
  });

  if (!active) return null;
  return slot;
}
