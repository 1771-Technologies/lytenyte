import { useSlot, type SlotComponent } from "@1771technologies/lytenyte-core/yinternal";
import { forwardRef, type JSX } from "react";
import { useFilterRow } from "./filter-row-context.js";

export interface ValueInputSlotProps {
  readonly value: string | number | null | undefined;
  readonly onValueChange: (v: string | number | null) => void;
  readonly disabled: boolean;
  readonly isNumberInput: boolean;
  readonly filterNeedsValue: boolean;
}

export interface ValueInputProps {
  readonly as?: SlotComponent<ValueInputSlotProps>;
}

function ValueInputImpl(
  { as, ...props }: JSX.IntrinsicElements["input"] & ValueInputProps,
  ref: JSX.IntrinsicElements["input"]["ref"],
) {
  const ctx = useFilterRow();
  const slot = useSlot({
    slot: as ?? (
      <>
        {!ctx.filterHasNoValue && (
          <input
            type={
              ctx.filter.kind === "number" || ctx.isNumberInput
                ? "number"
                : ctx.filter.kind === "date"
                  ? "date"
                  : "text"
            }
            value={ctx.value ?? ""}
            onChange={(e) => {
              ctx.onValueChange(e.target.value);
            }}
          />
        )}
      </>
    ),
    props: [props],
    ref,
    state: {
      disabled: ctx.valueDisabled,
      filterNeedsValue: ctx.filterHasNoValue,
      isNumberInput: ctx.isNumberInput,
      onValueChange: ctx.onValueChange,
      value: ctx.value,
    } satisfies ValueInputSlotProps,
  });

  return slot;
}

export const ValueInput = forwardRef(ValueInputImpl);
