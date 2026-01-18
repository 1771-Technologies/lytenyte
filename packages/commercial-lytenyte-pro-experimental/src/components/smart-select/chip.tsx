import { forwardRef, type JSX } from "react";
import { useSlot, type SlotComponent } from "../../hooks/use-slot/index.js";
import type { BaseOption } from "./type.js";
import { useChipContext } from "./chip-context.js";
import { useSmartSelect } from "./context.js";
import { useEvent } from "@1771technologies/lytenyte-core-experimental/internal";

export type ChipProps<T extends BaseOption> = JSX.IntrinsicElements["div"] & {
  readonly option: T;
  readonly render?: SlotComponent<{ option: T; active: boolean; remove: () => void }>;
};

function ChipBase<T extends BaseOption>(
  { render, option, ...props }: ChipProps<T>,
  ref: JSX.IntrinsicElements["div"]["ref"],
) {
  const { activeChip, setActiveChip } = useChipContext();
  const {
    kindAndValue: { value },
    onOptionsChange,
    preventNextOpen,
    rtl,
    trigger,
    inputRef,
  } = useSmartSelect();

  const v = value as T[];

  const remove = useEvent(() => {
    onOptionsChange(v.filter((x) => x.id !== option.id));
    preventNextOpen.current = true;
  });

  const r = useSlot({
    props: [
      props,
      { tabIndex: -1, "data-ln-smart-select-chip": option.id },
      {
        onKeyDown: (ev) => {
          const start = rtl ? "ArrowRight" : "ArrowLeft";
          const end = rtl ? "ArrowLeft" : "ArrowRight";

          const chips = Array.from(trigger!.querySelectorAll("[data-ln-smart-select-chip]")) as HTMLElement[];

          const thisIndex = chips.indexOf(ev.currentTarget);
          if (thisIndex === -1) return;

          if (ev.key === "Backspace" || ev.key === "Delete") {
            remove();

            const dir = ev.key === "Backspace" ? 1 : -1;

            let next = chips[thisIndex + dir];
            if (!next) next = chips[thisIndex - dir];
            if (!next) {
              setActiveChip(null);
              inputRef.current?.focus();
            } else {
              next.focus();
              setActiveChip(next.getAttribute("data-ln-smart-select-chip"));
            }
            return;
          }
          if (ev.key === "Delete" || ev.key === "Backspace") {
            console.log(" i ran");
          }

          if (ev.key === start) {
            const next = chips[thisIndex - 1];
            if (!next) return;

            next.focus();
            setActiveChip(next.getAttribute("data-ln-smart-select-chip"));
          } else if (ev.key === end) {
            const next = chips[thisIndex + 1];
            if (!next) {
              setActiveChip(null);
              inputRef.current?.focus();
            } else {
              next.focus();
              setActiveChip(next.getAttribute("data-ln-smart-select-chip"));
            }
          }
        },
      } satisfies JSX.IntrinsicElements["div"],
    ],
    ref: ref,
    slot: render ?? <div />,
    state: {
      option,
      active: activeChip === option.id,
      remove,
    },
  });

  return r;
}

export const Chip = forwardRef(ChipBase);
