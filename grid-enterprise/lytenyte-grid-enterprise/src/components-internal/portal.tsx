import { getPosition } from "@1771technologies/positioner";
import { useCombinedRefs } from "@1771technologies/react-utils";
import { useEffect, useState, type JSX } from "react";
import { createPortal } from "react-dom";

export function Portal({
  portalTarget,
  matchWidth,
  children,
  ...props
}: JSX.IntrinsicElements["div"] & { portalTarget: HTMLElement; matchWidth?: boolean }) {
  const [floating, setFloating] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!floating) return;

    const targetBb = portalTarget.getBoundingClientRect();
    if (matchWidth) floating.style.width = `${targetBb.width}px`;

    floating.style.display = "block";
    const dims = floating.getBoundingClientRect();

    const pos = getPosition({
      reference: targetBb,
      floating: { height: dims.height, width: dims.width },
      placement: "bottom-start",
      offset: 12,
    });

    floating.style.top = `${pos.y}px`;
    floating.style.left = `${pos.x}px`;
  }, [floating, matchWidth, portalTarget]);

  const merged = useCombinedRefs(setFloating, props.ref);

  return createPortal(
    <div {...props} style={{ display: "none", position: "absolute", ...props.style }} ref={merged}>
      {children}
    </div>,
    document.body,
  );
}
