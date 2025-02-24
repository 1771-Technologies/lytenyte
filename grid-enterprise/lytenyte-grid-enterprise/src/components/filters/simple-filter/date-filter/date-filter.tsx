import { DatePeriodSelect } from "./date-period-select";
import { DateOperatorSelect } from "./date-operator-select";
import { useId, useRef } from "react";
import type { FilterDate } from "@1771technologies/grid-types/community";
import { Input } from "@1771technologies/lytenyte-grid-community/internal";

export interface DateFilterProps {
  readonly filter: Partial<FilterDate>;
  readonly onChange: (v: { label: string; value: FilterDate["operator"] }) => void;
  readonly onValueChange: (v: string) => void;
  readonly onAllDatePeriodSelect: (v: FilterDate["datePeriod"]) => void;
}

const operatorsWithDate: FilterDate["operator"][] = ["equal", "after", "before"];

export function FilterDateInput({
  filter,
  onChange,
  onValueChange,
  onAllDatePeriodSelect,
}: DateFilterProps) {
  const operator = filter.operator;

  const ref = useRef<HTMLInputElement>(null);
  const selectRef = useRef<HTMLButtonElement>(null);

  const change: DateFilterProps["onChange"] = (v) => {
    onChange(v);
    // Need to set timeout as the browser will return the dialog focus
    // to the select button.
    setTimeout(() => {
      // one of these may be mounted.
      ref.current?.focus();
      selectRef.current?.focus();
    }, 2);
  };

  const id = useId();

  return (
    <>
      <DateOperatorSelect filter={filter} onChange={change} />
      {!operator && <Input disabled type="date" />}
      {operator && operatorsWithDate.includes(operator) && (
        <>
          <Input
            small
            id={id}
            ref={ref}
            type="date"
            onChange={(e) => onValueChange(e.target.value)}
            value={filter.value ?? ""}
          />
          <label htmlFor={id} className="lng1771-sr-only">
            Date filter
          </label>
        </>
      )}
      {operator === "all_dates_in_the_period" && (
        <DatePeriodSelect
          selectRef={selectRef}
          value={filter.datePeriod ?? null}
          onAllDatePeriodSelect={onAllDatePeriodSelect}
        />
      )}
    </>
  );
}
