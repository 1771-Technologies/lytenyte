import { getPosition, type Rect } from "@1771technologies/positioner";
import { useEvent } from "@1771technologies/react-utils";
import { useCallback, useEffect, useState, type PropsWithChildren } from "react";
import { createPortal } from "react-dom";

export interface TooltipPortalProps {
  readonly target: HTMLElement | Rect;
  readonly shown: boolean;
  readonly onInit: (el: HTMLElement) => void;
  readonly onOpen: (el: HTMLElement) => void;
  readonly onClose: (el: HTMLElement) => void;
}
export function TooltipPortal({
  shown,
  children,
  target,
  onClose,
  onInit,
  onOpen,
}: PropsWithChildren<TooltipPortalProps>) {
  const [ref, setRef] = useState<HTMLElement | null>(null);

  const onInitEvent = useEvent(onInit);
  const onCloseEvent = useEvent(onClose);
  const onOpenEvent = useEvent(onOpen);

  useEffect(() => {
    if (!ref) return;

    ref.style.display = "block";
    const reference = "getBoundingClientRect" in target ? target.getBoundingClientRect() : target;
    const floating = ref.getBoundingClientRect();

    const c = getPosition({ reference, floating, placement: "bottom" });

    ref.style.top = `${c.y}px`;
    ref.style.left = `${c.x}px`;
  }, [onInitEvent, ref, target]);

  useEffect(() => {
    if (!ref) return;

    if (shown) onOpenEvent(ref);
    else onCloseEvent(ref);
  }, [onCloseEvent, onOpenEvent, ref, shown]);

  return createPortal(
    <div
      ref={useCallback(
        (el: HTMLElement | null) => {
          setRef(el);
          if (!el) return;

          onInitEvent(el);
        },
        [onInitEvent],
      )}
      style={{ position: "fixed", display: "none", transition: "opacity 200ms linear" }}
    >
      {children}
    </div>,
    document.body,
  );
}
