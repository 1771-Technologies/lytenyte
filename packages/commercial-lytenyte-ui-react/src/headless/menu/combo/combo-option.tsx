import { forwardRef, useEffect, useState, type JSX } from "react";
import { useCombinedRefs } from "../../../hooks/use-combined-ref.js";
import { useComboContext } from "./combo-context.js";
import { useDialogRoot } from "../../dialog/context.js";

function ComboOptionImpl(
  { disabled, onAction, closeOnAction, ...props }: ComboOption.Props,
  ref: ComboOption.Props["ref"],
) {
  const [item, setItem] = useState<HTMLDivElement | null>(null);
  const ctx = useComboContext();
  const d = useDialogRoot();

  useEffect(() => {
    if (!item) return;

    const controller = new AbortController();
    item.addEventListener(
      "ln-action",
      () => {
        onAction();
        if (closeOnAction === false) return;

        d.onOpenChange?.(false);
      },
      { signal: controller.signal },
    );

    return () => controller.abort();
  }, [closeOnAction, d, item, onAction]);

  const active = ctx.activeEl === item;

  return (
    <div
      {...props}
      data-ln-active={active}
      data-ln-combomenu-option
      data-ln-disabled={disabled ? true : undefined}
      inert={disabled ? true : undefined}
      onClick={(ev) => {
        props.onClick?.(ev);
        if (ev.isPropagationStopped()) return;

        onAction();
        if (closeOnAction === false) return;
        d.onOpenChange?.(false);
      }}
      onMouseEnter={() => {
        ctx.setActiveEl(item);
      }}
      onMouseLeave={() => {
        ctx.setActiveEl(null);
      }}
      ref={useCombinedRefs(ref, setItem)}
    />
  );
}

export const ComboOption = forwardRef(ComboOptionImpl);

export namespace ComboOption {
  export type Props = JSX.IntrinsicElements["div"] & {
    disabled?: boolean;
    onAction: () => void;
    closeOnAction?: boolean;
  };
}
