import type { FilterNumber } from "@1771technologies/grid-types/community";
import { NumberOperatorSelect } from "./number-operator-select";
import { useRef } from "react";
import { Input } from "../../../input/Input";

interface NumberFilterProps {
  readonly filter: Partial<FilterNumber>;
  readonly onChange: (v: { label: string; value: FilterNumber["operator"] }) => void;
  readonly onValueChange: (v: number) => void;
}

export function FilterNumberInput({ filter, onChange, onValueChange }: NumberFilterProps) {
  const operator = filter.operator;

  const ref = useRef<HTMLInputElement>(null);

  const change: NumberFilterProps["onChange"] = (v) => {
    onChange(v);
    // Need to set timeout as the browser will return the dialog focus
    // to the select button.
    setTimeout(() => {
      ref.current?.focus();
    }, 2);
  };

  return (
    <>
      <NumberOperatorSelect filter={filter} onChange={change} />
      <Input
        small
        type="number"
        inputRef={ref}
        disabled={!operator}
        value={filter.value ?? ""}
        onChange={(e) => onValueChange(Number.parseFloat(e.target.value))}
      />
    </>
  );
}
