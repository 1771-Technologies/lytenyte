import type { FilterDate } from "@1771technologies/grid-types/community";
import { useMemo } from "react";
import { cc } from "../../../component-configuration";
import { Select, type SelectItem } from "../../../select/select";

interface DateOperatorSelectProps {
  readonly filter: Partial<FilterDate>;
  readonly onChange: (v: { label: string; value: FilterDate["operator"] }) => void;
}

const operatorsWithDate: FilterDate["operator"][] = ["equal", "after", "before"];

export function DateOperatorSelect({ filter, onChange }: DateOperatorSelectProps) {
  const value = useMemo(() => {
    if (!filter.operator) return null;
    return { label: valueToLabel[filter.operator], value: filter.operator };
  }, [filter.operator]);

  const operator = filter.operator;

  const config = cc.filter.use();
  const fullSpan =
    operator && !operatorsWithDate.includes(operator) && operator !== "all_dates_in_the_period";

  return (
    <Select
      axe={config.simpleFilter!.axeDateOperator}
      style={{ gridColumn: fullSpan ? "span 2" : undefined }}
      placeholder={config.simpleFilter?.placeholderNoChoice}
      items={dateItems}
      value={value}
      onSelect={onChange as any}
    />
  );
}
const valueToLabel: Record<FilterDate["operator"], string> = {
  equal: "Equal",
  before: "Before",
  after: "After",
  tomorrow: "Tomorrow",
  today: "Today",
  yesterday: "Yesterday",

  next_week: "Next Week",
  this_week: "This Week",
  last_week: "Last Week",

  next_month: "Next Month",
  this_month: "This Month",
  last_month: "Last Month",

  next_quarter: "Next Quarter",
  this_quarter: "This Quarter",
  last_quarter: "Last Quarter",

  next_year: "Next Year",
  this_year: "This Year",
  last_year: "Last Year",

  ytd: "Year To Date",
  all_dates_in_the_period: "All Dates In Period",
};

const dateItems: SelectItem[] = [
  { label: "Equal", value: "equal" },

  { label: "Before", value: "before" },
  { label: "After", value: "after" },

  { label: "Tomorrow", value: "tomorrow" },
  { label: "Today", value: "today" },
  { label: "Yesterday", value: "yesterday" },

  { label: "Next Week", value: "next_week" },
  { label: "This Week", value: "this_week" },
  { label: "Last Week", value: "last_week" },

  { label: "Next Month", value: "next_month" },
  { label: "This Month", value: "this_month" },
  { label: "Last Month", value: "last_month" },

  { label: "Next Quarter", value: "next_quarter" },
  { label: "This Quarter", value: "this_quarter" },
  { label: "Last Quarter", value: "last_quarter" },

  { label: "Next Year", value: "next_year" },
  { label: "This Year", value: "this_year" },
  { label: "Last Year", value: "last_year" },

  { label: "Year To Date", value: "ytd" },

  { label: "All Dates In Period", value: "all_dates_in_the_period" },
];
