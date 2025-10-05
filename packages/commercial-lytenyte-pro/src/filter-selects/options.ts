import type { SelectOption } from "./operator-select";

export const numberOptions: SelectOption[] = [
  { label: "Equals", value: "equals" },
  { label: "Not Equals", value: "not_equals" },
  { label: "Less Than", value: "less_than" },
  { label: "Less Than Or Equals", value: "less_than_or_equals" },
  { label: "Greater Than", value: "greater_than" },
  { label: "Greater Than or Equals", value: "greater_than_or_equals" },
];

export const stringOptions: SelectOption[] = [
  { label: "Equals", value: "equals" },
  { label: "Not Equals", value: "not_equals" },
  { label: "Less Than", value: "less_than" },
  { label: "Less Than Or Equals", value: "less_than_or_equals" },
  { label: "Greater Than", value: "greater_than" },
  { label: "Greater Than Or Equals", value: "greater_than_or_equals" },
  { label: "Begins With", value: "begins_with" },
  { label: "Not Begins With", value: "not_begins_with" },
  { label: "Ends With", value: "ends_with" },
  { label: "Not Ends With", value: "not_ends_with" },
  { label: "Contains", value: "contains" },
  { label: "Not Contains", value: "not_contains" },
  { label: "Length", value: "length" },
  { label: "Not Length", value: "not_length" },
  { label: "Matches", value: "matches" },
  { label: "Length Less Than", value: "length_less_than" },
  { label: "Length Less Than Or Equals", value: "length_less_than_or_equals" },
  { label: "Length Greater Than", value: "length_greater_than" },
  { label: "Length Greater Than Or Equals", value: "length_greater_than_or_equals" },
];

export const dateOptions: SelectOption[] = [
  { label: "Equals", value: "equals" },
  { label: "Not Equals", value: "not_equals" },
  { label: "Before", value: "before" },
  { label: "Before Or Equals", value: "before_or_equals" },
  { label: "After", value: "after" },
  { label: "After Or Equals", value: "after_or_equals" },
  { label: "Year To Date", value: "year_to_date" },
  { label: "This Week", value: "this_week" },
  { label: "This Month", value: "this_month" },
  { label: "This Year", value: "this_year" },
  { label: "Last Week", value: "last_week" },
  { label: "Last Month", value: "last_month" },
  { label: "Last Year", value: "last_year" },
  { label: "Next Week", value: "next_week" },
  { label: "Next Month", value: "next_month" },
  { label: "Next Year", value: "next_year" },
  { label: "Today", value: "today" },
  { label: "Tomorrow", value: "tomorrow" },
  { label: "Yesterday", value: "yesterday" },
  { label: "Week Of Year", value: "week_of_year" },
  { label: "Quarter Of Year", value: "quarter_of_year" },
  { label: "Is Weekend", value: "is_weekend" },
  { label: "Is Weekday", value: "is_weekday" },
  { label: "N Days Ago", value: "n_days_ago" },
  { label: "N Days Ahead", value: "n_days_ahead" },
  { label: "N Weeks Ago", value: "n_weeks_ago" },
  { label: "N Weeks Ahead", value: "n_weeks_ahead" },
  { label: "N Months Ago", value: "n_months_ago" },
  { label: "N Months Ahead", value: "n_months_ahead" },
  { label: "N Years Ago", value: "n_years_ago" },
  { label: "N Years Ahead", value: "n_years_ahead" },
];

export const operatorToOption = Object.fromEntries(
  [...numberOptions, ...stringOptions, ...dateOptions].map((c) => {
    return [c.value, c];
  }),
);

export const operatorsThatAreNumbers = new Set([
  "n_days_ago",
  "n_days_ahead",
  "n_weeks_ago",
  "n_weeks_ahead",
  "n_months_ago",
  "n_months_ahead",
  "n_years_ago",
  "n_years_ahead",
  "length",
  "not_length",
  "length_less_than",
  "length_less_than_or_equals",
  "length_greater_than",
  "length_greater_than_or_equals",
  "week_of_year",
  "quarter_of_year",
]);

export const filterNeedsValue = new Set([
  "year_to_date",
  "this_week",
  "this_month",
  "this_year",
  "last_week",
  "last_month",
  "last_year",
  "next_week",
  "next_month",
  "next_year",
  "today",
  "tomorrow",
  "yesterday",
  "is_weekend",
  "is_weekday",
]);
