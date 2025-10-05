import { useSlot, type SlotComponent } from "@1771technologies/lytenyte-core/yinternal";
import { forwardRef, type JSX } from "react";
import { useFilterRow } from "./filter-row-context.js";

export type SelectOption = { label: string; value: string };

export interface OperatorSelectSlotProps {
  readonly options: SelectOption[];
  readonly value: SelectOption | null;
  readonly onChange: (v: SelectOption) => void;
}

export interface OperatorSelectProps {
  readonly as?: SlotComponent<OperatorSelectSlotProps>;
}

function OperatorSelectImpl(
  { as, ...props }: JSX.IntrinsicElements["select"] & OperatorSelectProps,
  ref: JSX.IntrinsicElements["select"]["ref"],
) {
  const ctx = useFilterRow();

  const slot = useSlot({
    props: [props],
    state: {
      options: ctx.operatorOptions,
      value: ctx.operatorValue,
      onChange: ctx.operatorOnChange,
    },
    ref: ref,
    slot: as ?? (
      <select
        value={ctx.operatorValue?.value ?? ""}
        onChange={(c) => {
          const val = c.target.value;

          const opt = ctx.operatorOptions.find((c) => c.value === val)!;
          ctx.operatorOnChange(opt);
        }}
      >
        {ctx.operatorOptions.map((c) => {
          return (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          );
        })}
      </select>
    ),
  });

  return slot;
}

export const OperatorSelect = forwardRef(OperatorSelectImpl);
