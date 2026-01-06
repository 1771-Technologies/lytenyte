import { forwardRef, useState, type JSX } from "react";
import { useMenuItemEvents } from "./use-menu-item-events.js";
import { handleVerticalNavigation } from "./handle-vertical-navigation.js";
import { useDialogRoot } from "../../dialog/context.js";
import { useCombinedRefs } from "@1771technologies/lytenyte-core-experimental/internal";

function ItemImpl({ onAction, closeOnAction, disabled, ...props }: Item.Props, ref: Item.Props["ref"]) {
  const [item, setItem] = useState<HTMLDivElement | null>(null);

  const combinedRefs = useCombinedRefs(ref, setItem);

  const [active, setActive] = useMenuItemEvents(item);

  const d = useDialogRoot();

  return (
    <div
      role="menuitem"
      {...props}
      ref={combinedRefs}
      tabIndex={0}
      data-ln-menu-item
      data-ln-active={active}
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
        onAction?.();
        if (closeOnAction === false) return;
        d?.onOpenChange(false);
      }}
      onKeyDown={(ev) => {
        if (ev.key === "ArrowUp" || ev.key === "ArrowDown") handleVerticalNavigation(ev);
        if (ev.key === " " || ev.key === "Enter") {
          onAction?.();
          if (closeOnAction === false) return;
          d?.onOpenChange(false);
        }
      }}
    />
  );
}

export const Item = forwardRef(ItemImpl);

export namespace Item {
  export type Props = JSX.IntrinsicElements["div"] & {
    readonly disabled?: boolean;
    readonly onAction: () => void;
    readonly closeOnAction?: boolean;
  };
}
