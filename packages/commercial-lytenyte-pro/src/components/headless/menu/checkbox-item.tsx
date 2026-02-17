import { forwardRef, useState, type JSX, type ReactNode } from "react";
import { useMenuItemEvents } from "./item/use-menu-item-events.js";
import { handleVerticalNavigation } from "./item/handle-vertical-navigation.js";
import { useDialogRoot } from "../dialog/context.js";
import { useCombinedRefs } from "@1771technologies/lytenyte-core/internal";

function CheckboxItemImpl(
  { checked, onCheckChange, closeOnAction, disabled, children, ...props }: CheckboxItem.Props,
  ref: CheckboxItem.Props["ref"],
) {
  const [item, setItem] = useState<HTMLDivElement | null>(null);

  const combinedRefs = useCombinedRefs(ref, setItem);

  const [active, setActive] = useMenuItemEvents(item);

  const Node = typeof children === "function" ? children(checked) : children;

  const d = useDialogRoot();

  return (
    <div
      role="menuitemcheckbox"
      {...props}
      ref={combinedRefs}
      tabIndex={0}
      data-ln-menu-item
      data-ln-active={active}
      data-ln-checked={checked}
      aria-checked={checked}
      data-ln-disabled={disabled ? true : undefined}
      inert={disabled ? true : undefined}
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
        onCheckChange?.(!checked);
        if (closeOnAction === false) return;
        d?.onOpenChange(false);
      }}
      onKeyDown={(ev) => {
        if (ev.key === "ArrowUp" || ev.key === "ArrowDown") handleVerticalNavigation(ev);
        if (ev.key === " " || ev.key === "Enter") {
          onCheckChange?.(!checked);
          if (closeOnAction === false) return;
          d?.onOpenChange(false);
        }
      }}
    >
      {Node}
    </div>
  );
}

export const CheckboxItem = forwardRef(CheckboxItemImpl);

export namespace CheckboxItem {
  export type Props = Omit<JSX.IntrinsicElements["div"], "children"> & {
    readonly disabled?: boolean;
    readonly checked: boolean;
    readonly onCheckChange?: (b: boolean) => void;
    readonly children?: ReactNode | ((b: boolean) => ReactNode);
    readonly closeOnAction?: boolean;
  };
}
