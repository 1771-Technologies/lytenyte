import { forwardRef, useId, useState, type JSX } from "react";
import { useTooltipRoot } from "./context";
import { useForkRef, useSlot, type SlotComponent } from "@1771technologies/lytenyte-react-hooks";

export interface TooltipPanelProps {
  as?: SlotComponent;
}

export const TooltipPanel = forwardRef<
  HTMLDivElement,
  JSX.IntrinsicElements["div"] & TooltipPanelProps
>(function TooltipPanel({ as, ...props }, forwarded) {
  const ctx = useTooltipRoot();

  const id = useId();
  const ref = useForkRef(ctx.contentRef, forwarded);

  const [over, setOver] = useState(false);
  const defaultProps: JSX.IntrinsicElements["div"] = {
    id,
    role: "tooltip",
    onMouseEnter: () => {
      setOver(true);
      if (ctx.interactive) ctx.beginOpen();
    },
    onMouseLeave: () => {
      setOver(false);
      if (ctx.interactive) {
        /* v8 ignore next 1 */
        if (ctx.content?.contains(document.activeElement)) return;
        ctx.beginClose();
      }
    },
    onFocus: () => {
      if (!ctx.interactive) return;
      ctx.beginOpen();
    },
    onBlur: () => {
      if (!over) ctx.beginClose();
    },
  };

  const rendered = useSlot({
    props: [defaultProps, props],
    slot: as ?? <div />,
    ref,
  });

  return rendered;
});
