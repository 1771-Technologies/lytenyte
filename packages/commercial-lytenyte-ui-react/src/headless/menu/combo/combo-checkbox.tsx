import { forwardRef, useEffect, useState, type JSX, type ReactNode } from "react";
import { useCombinedRefs } from "../../../hooks/use-combined-ref.js";
import { useComboContext } from "./combo-context.js";
import { useDialogRoot } from "../../dialog/context.js";

function ComboCheckboxBase(
  { checked, onCheckChange, children, closeOnAction, ...props }: ComboCheckbox.Props,
  ref: ComboCheckbox.Props["ref"]
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
        onCheckChange?.(!checked);
        if (closeOnAction === false) return;

        d.onOpenChange?.(false);
      },
      { signal: controller.signal }
    );

    return () => controller.abort();
  }, [checked, closeOnAction, d, item, onCheckChange]);

  const active = ctx.activeEl === item;

  const Node = typeof children === "function" ? children(checked) : children;
  return (
    <div
      {...props}
      data-ln-active={active}
      data-ln-combomenu-option
      data-ln-checked={checked}
      onClick={(ev) => {
        props.onClick?.(ev);
        if (ev.isPropagationStopped()) return;

        onCheckChange?.(!checked);
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
    >
      {Node}
    </div>
  );
}

export const ComboCheckbox = forwardRef(ComboCheckboxBase);

export namespace ComboCheckbox {
  export type Props = Omit<JSX.IntrinsicElements["div"], "children"> & {
    readonly checked: boolean;
    readonly onCheckChange?: (b: boolean) => void;
    readonly children?: ReactNode | ((b: boolean) => ReactNode);
    readonly closeOnAction?: boolean;
  };
}
