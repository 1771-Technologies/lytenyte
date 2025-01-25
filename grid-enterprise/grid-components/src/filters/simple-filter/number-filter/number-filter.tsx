import type { FilterNumber } from "@1771technologies/grid-types/community";
import { NumberOperatorSelect } from "./number-operator-select";
import { useId, useRef } from "react";
import { cc } from "../../../component-configuration";
import { Input } from "@1771technologies/lytenyte-grid-community/internal";

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

  const config = cc.filter.use();
  const id = useId();

  return (
    <>
      <NumberOperatorSelect filter={filter} onChange={change} />
      <Input
        id={id}
        small
        type="number"
        inputRef={ref}
        disabled={!operator}
        value={filter.value ?? ""}
        onChange={(e) => onValueChange(Number.parseFloat(e.target.value))}
      />
      <label htmlFor={id} className="lng1771-sr-only">
        {config.simpleFilter?.labelNumber}
      </label>
    </>
  );
}
