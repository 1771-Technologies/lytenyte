import { cloneElement, useState, type ReactElement } from "react";
import { usePositioner, type UsePositioner } from "./use-positioner.js";
import {
  getElementRef,
  mergeProps,
  useEvent,
  useForkRef,
} from "@1771technologies/lytenyte-react-hooks";

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
}: {
  children: ReactElement;
} & Omit<UsePositioner, "floating">) {
  const [floating, setFloating] = useState<HTMLElement | null>(null);

  const internalRef = useEvent((el: HTMLElement | null) => {
    setFloating(el);
    if (!el) return;

    el.style.display = "none";
  });

  const ref = getElementRef(children);

  const mergedProps = mergeProps(props, children.props as any);
  mergedProps.ref = useForkRef(ref, internalRef);

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

  if (!active) return null;

  return cloneElement(children, mergedProps);
}
