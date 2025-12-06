import { forwardRef, useContext, useState, type JSX, type ReactNode } from "react";
import { useMenuItemEvents } from "../item/use-menu-item-events.js";
import { handleVerticalNavigation } from "../item/handle-vertical-navigation.js";
import { context } from "./context.js";
import { useCombinedRefs } from "@1771technologies/lytenyte-hooks-react";
import { useDialogRoot } from "../../dialog/context.js";

function ItemImpl(
  { value, disabled, children, closeOnAction, ...props }: RadioItem.Props,
  ref: RadioItem.Props["ref"],
) {
  const [item, setItem] = useState<HTMLDivElement | null>(null);

  const combinedRefs = useCombinedRefs(ref, setItem);

  const [active, setActive] = useMenuItemEvents(item);
  const ctx = useContext(context);

  const Node = typeof children === "function" ? children(ctx.value === value) : children;

  const d = useDialogRoot();

  return (
    <div
      {...props}
      role="menuitemradio"
      ref={combinedRefs}
      tabIndex={0}
      aria-checked={ctx.value === value}
      data-ln-disabled={disabled ? true : undefined}
      inert={disabled ? true : undefined}
      data-ln-menu-item
      data-ln-active={active}
      data-ln-checked={ctx.value === value}
      onFocus={(ev) => {
        props.onFocus?.(ev);
        if (ev.isPropagationStopped()) return;
        setActive(true);
      }}
      onBlur={(ev) => {
        props.onBlur?.(ev);
        if (ev.isPropagationStopped()) return;
        setActive(false);
      }}
      onClick={(ev) => {
        props.onClick?.(ev);
        if (ev.isPropagationStopped()) return;

        ctx.onChange?.(value);
        if (closeOnAction === false) return;
        d?.onOpenChange(false);
      }}
      onKeyDown={(ev) => {
        if (ev.key === "ArrowUp" || ev.key === "ArrowDown") handleVerticalNavigation(ev);
        if (ev.key === " " || ev.key === "Enter") {
          ctx.onChange?.(value);
          if (closeOnAction === false) return;
          d?.onOpenChange(false);
        }
      }}
    >
      {Node}
    </div>
  );
}

export const RadioItem = forwardRef(ItemImpl);

export namespace RadioItem {
  export type Props = Omit<JSX.IntrinsicElements["div"], "children"> & {
    readonly disabled?: boolean;
    readonly value: string;
    readonly children?: ReactNode | ((checked: boolean) => ReactNode);
    readonly closeOnAction?: boolean;
  };
}
