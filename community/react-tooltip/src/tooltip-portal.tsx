import { getPosition, type Placement, type Rect } from "@1771technologies/positioner";
import { Arrow } from "@1771technologies/react-popover";
import { useEvent } from "@1771technologies/react-utils";
import {
  useCallback,
  useEffect,
  useState,
  type CSSProperties,
  type PropsWithChildren,
} from "react";
import { createPortal } from "react-dom";
import type { ShowTooltipParams, TooltipApi } from "./tooltip";

export interface TooltipPortalProps {
  readonly target: HTMLElement | Rect;
  readonly shown: boolean;
  readonly offset: number;
  readonly placement: Placement;

  readonly arrowColor?: string;
  readonly className?: string;
  readonly style?: CSSProperties;

  readonly api: TooltipApi;
  readonly params: ShowTooltipParams;

  readonly onInit: (el: HTMLElement) => void;
  readonly onOpen: (el: HTMLElement) => void;
  readonly onClose: (el: HTMLElement) => void;
}
export function TooltipPortal({
  shown,
  children,
  target,
  placement,
  offset,
  onClose,
  onInit,
  onOpen,
  className,
  style,
  arrowColor,
  params,
  api,
}: PropsWithChildren<TooltipPortalProps>) {
  const [ref, setRef] = useState<HTMLElement | null>(null);

  const [arrowP, setArrowP] = useState<Placement | null>(null);

  const onInitEvent = useEvent(onInit);
  const onCloseEvent = useEvent(onClose);
  const onOpenEvent = useEvent(onOpen);

  useEffect(() => {
    if (!ref) return;

    ref.style.display = "block";
    const reference = "getBoundingClientRect" in target ? target.getBoundingClientRect() : target;
    const floating = ref.getBoundingClientRect();

    const c = getPosition({ reference, floating, placement: placement, offset });

    ref.style.top = `${c.y}px`;
    ref.style.left = `${c.x}px`;

    setArrowP(c.placement);
  }, [offset, onInitEvent, placement, ref, target]);

  useEffect(() => {
    if (!ref) return;

    if (shown) onOpenEvent(ref);
    else onCloseEvent(ref);
  }, [onCloseEvent, onOpenEvent, ref, shown]);

  return createPortal(
    <div
      onPointerEnter={() => {
        api.show({
          ...params,
          content: children,
        });
      }}
      onPointerLeave={() => {
        api.close(params.id);
      }}
      role="tooltip"
      className={className}
      ref={useCallback(
        (el: HTMLElement | null) => {
          setRef(el);
          if (!el) return;

          onInitEvent(el);
        },
        [onInitEvent],
      )}
      style={{ ...style, position: "fixed", display: "none" }}
    >
      {children}
      {arrowP && (
        <Arrow
          placement={arrowP}
          popoverTarget={target}
          offset={offset}
          arrowColor={arrowColor ?? "black"}
        />
      )}
    </div>,
    document.body,
  );
}
