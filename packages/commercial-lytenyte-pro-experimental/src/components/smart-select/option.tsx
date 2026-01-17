import { forwardRef, type JSX } from "react";
import { useSlot, type SlotComponent } from "../../hooks/use-slot/index.js";
import type { BaseOption, OptionRenderProps } from "./type.js";
import { useSmartSelect } from "./context.js";

export type OptionTriggerProps<T extends BaseOption> = JSX.IntrinsicElements["div"] & {
  readonly render?: SlotComponent<OptionRenderProps<T>>;
  readonly closeOnSelect?: boolean;
} & OptionRenderProps<T>;

function OptionBase<T extends BaseOption>(
  { render, option, active, selected, closeOnSelect: closeOverride, ...props }: OptionTriggerProps<T>,
  ref: JSX.IntrinsicElements["div"]["ref"],
) {
  const { onOptionSelect, setActiveId, closeOnSelect, onOpenChange } = useSmartSelect();

  const closeOnSelectFinal = closeOverride ?? closeOnSelect;

  const r = useSlot({
    props: [
      {
        "data-ln-selected": selected,
        "data-ln-active": active,
        "data-ln-smart-option": option.id,
        "data-ln-selectable": option.selectable ?? true,
      },
      {
        onClick: () => {
          onOptionSelect(option);

          if (closeOnSelectFinal) onOpenChange(false);
        },
        onMouseEnter: () => setActiveId(option.id),
        onMouseLeave: () => setActiveId(null),
      } satisfies JSX.IntrinsicElements["div"],
      props,
    ],
    ref,
    slot: render,
    state: { option, selected, active },
  });

  return r;
}

export const Option = forwardRef(OptionBase);
