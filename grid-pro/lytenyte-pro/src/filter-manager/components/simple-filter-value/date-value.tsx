import { useSimpleFilterRoot } from "../simple-filter-root";
import { Input } from "@1771technologies/lytenyte-grid-community/internal";
import { useDateFilterCallbacks } from "../use-date-filter-callbacks";
import { useMemo } from "react";
import { Select } from "../../../select/select";
import type { FilterDatePro } from "@1771technologies/grid-types/pro";

const operatorsWithDate: FilterDatePro["operator"][] = ["equal", "after", "before"];
export function DateValue() {
  const { value } = useSimpleFilterRoot();

  const filter = value as Partial<FilterDatePro>;

  const operator = filter.operator;

  const { onValueChange, onDatePeriodChange } = useDateFilterCallbacks();

  return (
    <>
      {!operator && <Input disabled type="date" />}

      {operator && operatorsWithDate.includes(operator) && (
        <>
          <Input
            small
            type="date"
            onChange={(e) => onValueChange(e.target.value)}
            value={filter.value ?? ""}
          />
        </>
      )}
      {operator === "all_dates_in_the_period" && (
        <DatePeriodSelect
          value={filter.datePeriod ?? null}
          onAllDatePeriodSelect={onDatePeriodChange}
        />
      )}
    </>
  );
}

interface DatePeriodSelectProps {
  readonly value: FilterDatePro["datePeriod"] | null;
  readonly onAllDatePeriodSelect: (v: FilterDatePro["datePeriod"]) => void;
}

function DatePeriodSelect({ value, onAllDatePeriodSelect }: DatePeriodSelectProps) {
  const item = useMemo(() => {
    if (!value) return null;

    return { label: allDatePeriodValueToLabel[value], value };
  }, [value]);

  return (
    <Select
      options={allDatePeriodOptions}
      selected={item}
      placeholder="Select..."
      onSelect={(v) => {
        onAllDatePeriodSelect(v!.value as any);
      }}
    />
  );
}

const allDatePeriodValueToLabel: Record<NonNullable<FilterDatePro["datePeriod"]>, string> = {
  "quarter-1": "Quarter 1",
  "quarter-2": "Quarter 2",
  "quarter-3": "Quarter 3",
  "quarter-4": "Quarter 4",
  january: "January",
  february: "February",
  march: "March",
  april: "April",
  may: "May",
  june: "June",
  july: "July",
  august: "August",
  september: "September",
  october: "October",
  november: "November",
  december: "December",
};

const allDatePeriodOptions = [
  { label: "Quarter 1", value: "quarter-1" },
  { label: "Quarter 2", value: "quarter-2" },
  { label: "Quarter 3", value: "quarter-3" },
  { label: "Quarter 4", value: "quarter-4" },
  { label: "January", value: "january" },
  { label: "February", value: "february" },
  { label: "March", value: "march" },
  { label: "April", value: "april" },
  { label: "May", value: "may" },
  { label: "June", value: "june" },
  { label: "July", value: "july" },
  { label: "August", value: "august" },
  { label: "September", value: "september" },
  { label: "October", value: "october" },
  { label: "November", value: "november" },
  { label: "December", value: "december" },
];
