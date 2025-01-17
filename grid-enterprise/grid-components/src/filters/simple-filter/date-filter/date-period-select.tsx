import type { FilterDate } from "@1771technologies/grid-types/community";
import type { RefObject } from "react";
import { useMemo } from "react";
import { cc } from "../../../component-configuration";
import { Select, type SelectItem } from "../../../select/select";

interface DatePeriodSelectProps {
  readonly value: FilterDate["datePeriod"] | null;
  readonly onAllDatePeriodSelect: (v: FilterDate["datePeriod"]) => void;
  readonly selectRef: RefObject<HTMLButtonElement | null>;
}

export function DatePeriodSelect({
  value,
  onAllDatePeriodSelect,
  selectRef,
}: DatePeriodSelectProps) {
  const item = useMemo(() => {
    if (!value) return null;

    return { label: allDatePeriodValueToLabel[value], value };
  }, [value]);

  const config = cc.filter.use();
  const noChoice = config.simpleFilter?.placeholderNoChoice ?? "";

  return (
    <Select
      axe={config.simpleFilter!.datePeriodAxe}
      selectRef={selectRef}
      items={allDatePeriodOptions}
      value={item}
      placeholder={noChoice}
      onSelect={(v) => {
        onAllDatePeriodSelect(v.value as FilterDate["datePeriod"]);
      }}
    />
  );
}

const allDatePeriodValueToLabel: Record<NonNullable<FilterDate["datePeriod"]>, string> = {
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

const allDatePeriodOptions: SelectItem[] = [
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
