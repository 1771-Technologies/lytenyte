import { useSlot, type SlotComponent } from "@1771technologies/lytenyte-core/yinternal";
import { forwardRef, type JSX } from "react";
import { useFilterRow } from "./filter-row-context.js";

export interface FilterCombinatorSlotProps {
  readonly value: "AND" | "OR" | null;
  readonly onChange: (v: "AND" | "OR" | null) => void;
  readonly shouldShow: boolean;
}

export interface FilterCombinatorProps {
  readonly as?: SlotComponent<FilterCombinatorSlotProps>;
}

function FilterCombinatorImpl(
  { as, ...props }: JSX.IntrinsicElements["div"] & FilterCombinatorProps,
  ref: JSX.IntrinsicElements["div"]["ref"],
) {
  const ctx = useFilterRow();

  const slot = useSlot({
    props: [props],
    ref: ref,
    slot: as ?? (
      <>
        {ctx.showExtender && (
          <div {...props} ref={ref}>
            <label>
              AND
              <input
                type="radio"
                checked={ctx.extender === "AND"}
                value="AND"
                onChange={(e) => ctx.onExtenderChange(e.target.value as "AND")}
              />
            </label>
            <label>
              OR
              <input
                type="radio"
                checked={ctx.extender === "OR"}
                value="OR"
                onChange={(e) => ctx.onExtenderChange(e.target.value as "OR")}
              />
            </label>
          </div>
        )}
      </>
    ),
    state: {
      onChange: ctx.onExtenderChange,
      shouldShow: ctx.showExtender,
      value: ctx.extender,
    } satisfies FilterCombinatorSlotProps,
  });

  return slot;
}

export const FilterCombinator = forwardRef(FilterCombinatorImpl);
