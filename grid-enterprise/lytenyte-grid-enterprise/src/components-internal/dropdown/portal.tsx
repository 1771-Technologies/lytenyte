import { isLastTraversableNode, isTopLayer } from "@1771technologies/js-utils";
import { getPosition } from "@1771technologies/positioner";
import { refCompat, useCombinedRefs } from "@1771technologies/react-utils";
import { useEffect, useMemo, useState, type JSX } from "react";
import { createPortal } from "react-dom";

export interface PortalProps {
  readonly reference: HTMLElement;
  readonly matchWidth?: boolean;
}

function PortalImpl({
  reference,
  matchWidth,
  ...props
}: JSX.IntrinsicElements["div"] & PortalProps) {
  const parent = useMemo(() => {
    let current = reference;
    while (current && !isLastTraversableNode(current) && !isTopLayer(current)) {
      current = current.parentElement as HTMLElement;
    }

    if (current == null) return document.body;
    return current;
  }, [reference]);

  const [floating, setFloating] = useState<HTMLDivElement | null>(null);

  const combined = useCombinedRefs(setFloating, props.ref);

  useEffect(() => {
    if (!floating) return;

    const targetBB = reference.getBoundingClientRect();
    if (matchWidth) {
      floating.style.width = `${targetBB.width}px`;
    }

    const floatingBB = floating.getBoundingClientRect();

    const s = getPosition({
      floating: floatingBB,
      reference: targetBB,
      placement: "bottom",
      offset: 4,
    });

    floating.style.top = `${s.y}px`;
    floating.style.left = `${s.x}px`;
  }, [floating, matchWidth, reference]);

  return createPortal(
    <div {...props} style={{ position: "absolute", ...props.style }} ref={combined} />,
    parent,
  );
}

export const Portal = refCompat(PortalImpl, "Portal");
