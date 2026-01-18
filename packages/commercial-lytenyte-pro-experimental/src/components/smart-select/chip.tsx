import { forwardRef, type JSX } from "react";
import { useSlot, type SlotComponent } from "../../hooks/use-slot/index.js";
import type { BaseOption } from "./type.js";
import { useChipContext } from "./chip-context.js";
import { useSmartSelect } from "./context.js";

export type ChipProps<T extends BaseOption> = JSX.IntrinsicElements["div"] & {
  readonly option: T;
  readonly render?: SlotComponent<{ option: T; active: boolean; remove: () => void }>;
};

function ChipBase<T extends BaseOption>(
  { render, option, ...props }: ChipProps<T>,
  ref: JSX.IntrinsicElements["div"]["ref"],
) {
  const { activeChip } = useChipContext();
  const {
    kindAndValue: { value },
    onOptionsChange,
    preventNextOpen,
  } = useSmartSelect();

  const v = value as T[];

  const r = useSlot({
    props: [props, { tabIndex: -1, "data-ln-smart-select-chip": option.id }],
    ref: ref,
    slot: render ?? <div />,
    state: {
      option,
      active: activeChip === option.id,
      remove: () => {
        onOptionsChange(v.filter((x) => x.id !== option.id));
        preventNextOpen.current = true;
      },
    },
  });

  return r;
}

export const Chip = forwardRef(ChipBase);
