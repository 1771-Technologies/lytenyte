import { forwardRef, type JSX } from "react";
import { useFilterManagerState } from "../filter-state-context";
import { Radio } from "../../components-internal/radio/radio";
import { clsx } from "@1771technologies/js-utils";

export const SimpleFilterAdditionalSwitch = forwardRef<
  HTMLDivElement,
  JSX.IntrinsicElements["div"]
>(function SimpleFilterAdditionalSwitch(props, ref) {
  const { flatFilters, onFilterChange } = useFilterManagerState();

  const value = flatFilters[0][1];
  if (!value) return null;

  const onChange = (c: "and" | "or") => {
    const next = [...flatFilters];
    next[0] = [flatFilters[0][0], c];

    onFilterChange(next);
  };

  return (
    <div {...props} className={clsx("lng1771-filter-manager__switch", props.className)} ref={ref}>
      <div
        className={clsx(
          "lng1771-filter-manager__switch-item",
          "lng1771-filter-manager__switch-item--end",
        )}
      >
        <Radio checked={value === "and"} onCheckChange={() => onChange("and")} />
        And
      </div>
      <div className={clsx("lng1771-filter-manager__switch-item")}>
        <Radio checked={value === "or"} onCheckChange={() => onChange("or")} />
        Or
      </div>
    </div>
  );
});
