import { useForkRef, useSlot, type SlotComponent } from "@1771technologies/lytenyte-react-hooks";
import { forwardRef, type JSX } from "react";
import { useTooltipRoot } from "./context";

export interface TriggerProps {
  readonly as?: SlotComponent;
}

export const TooltipTrigger = forwardRef<
  HTMLButtonElement,
  JSX.IntrinsicElements["button"] & TriggerProps
>(function TooltipTrigger({ as, ...props }, forwarded) {
  const ctx = useTooltipRoot();

  const ref = useForkRef(ctx.triggerRef, forwarded);

  const defaultProps: JSX.IntrinsicElements["button"] = {
    onMouseEnter: () => {
      ctx.beginOpen();
    },
    onMouseLeave: () => {
      /* v8 ignore next 1 */
      if (ctx.content?.contains(document.activeElement)) return;

      ctx.beginClose();
    },
    onFocus: () => {
      ctx.beginOpen();
    },
    onBlur: () => {
      ctx.beginClose();
    },
    "aria-describedby": ctx.open ? ctx.content?.id : undefined,
  };

  const renderedSlot = useSlot({
    props: [defaultProps, props],
    slot: as ?? <button />,
    ref,
  });

  return renderedSlot;
});
