import { forwardRef, type JSX } from "react";
import { useComboContext } from "./combo-context.js";
import { handleVerticalNavigation } from "../item/handle-vertical-navigation.js";

const ComboInputImpl = ({ disabled, ...props }: ComboInput.Props, ref: ComboInput.Props["ref"]) => {
  const ctx = useComboContext();
  return (
    <input
      {...props}
      data-ln-combomenu-input
      data-ln-disabled={disabled ? true : undefined}
      disabled={disabled ? true : undefined}
      ref={ref}
      onBlur={(ev) => {
        props.onBlur?.(ev);

        ctx.setActiveEl(null);
      }}
      onKeyDown={(ev) => {
        props.onKeyDown?.(ev);
        if (!ctx.menu || ev.isPropagationStopped()) return;
        const value = ev.currentTarget.value ?? "";

        if (value && ev.key === "ArrowLeft") {
          ev.stopPropagation();
          return;
        }

        if (ev.key === "Enter") {
          if (ctx.activeEl) {
            ctx.activeEl.dispatchEvent(new Event("ln-action", { bubbles: false }));
          }
          return;
        }

        const queryResult = ctx.menu?.querySelectorAll("[data-ln-combomenu-option]");
        if (!queryResult || queryResult.length === 0) {
          return handleVerticalNavigation(ev);
        }
        const options = Array.from(queryResult) as HTMLDivElement[];

        const index = options.indexOf(ctx.activeEl!);

        if (ev.key === "ArrowUp") {
          if (index === 0) {
            handleVerticalNavigation({
              ...ev,
              currentTarget: ctx.menu!,
              stopPropagation: ev.stopPropagation,
              preventDefault: ev.preventDefault,
            });
            ctx.setActiveEl(null);
          } else {
            const finalIndex = index === -1 ? options.length - 1 : index - 1;
            ctx.setActiveEl(options[finalIndex]);
          }
        } else if (ev.key === "ArrowDown") {
          if (index === options.length - 1) {
            handleVerticalNavigation(ev);
            ctx.setActiveEl(null);
          } else {
            const finalIndex = index === -1 ? 0 : index + 1;
            ctx.setActiveEl(options[finalIndex]);
          }
        }
      }}
    />
  );
};

export const ComboInput = forwardRef(ComboInputImpl);

export namespace ComboInput {
  export type Props = Omit<JSX.IntrinsicElements["input"], "children"> & { disabled?: boolean };
}
