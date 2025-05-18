import { useSimpleFilterRoot } from "../simple-filter-root";
import { DateValue } from "./date-value";
import { NumberValue } from "./number-value";
import { TextValue } from "./text-value";

export function SimpleFilterValue() {
  const p = useSimpleFilterRoot();

  const kind = p.value.kind;

  if (kind === "date") {
    return <DateValue />;
  }

  if (kind === "number") {
    return <NumberValue />;
  }

  if (kind === "text") {
    return <TextValue />;
  }

  return null;
}
