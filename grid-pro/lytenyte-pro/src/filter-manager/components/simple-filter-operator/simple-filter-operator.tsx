import { useSimpleFilterRoot } from "../simple-filter-root";
import { DateOperatorSelect } from "./date-operator";
import { NumberOperatorSelect } from "./number-operator";
import { TextOperatorSelect } from "./text-operator";

export function SimpleFilterOperator() {
  const p = useSimpleFilterRoot();

  const kind = p.value.kind;

  if (kind === "date") {
    return <DateOperatorSelect />;
  }

  if (kind === "number") {
    return <NumberOperatorSelect />;
  }

  if (kind === "text") {
    return <TextOperatorSelect />;
  }

  return null;
}
