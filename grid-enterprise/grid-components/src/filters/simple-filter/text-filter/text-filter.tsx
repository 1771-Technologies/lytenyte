import type { FilterText } from "@1771technologies/grid-types/community";
import { TextOperatorSelect } from "./text-operator-select";
import { useId, useRef } from "react";
import { cc } from "../../../component-configuration";
import { Input } from "@1771technologies/lytenyte-grid-community/internal";

interface TextFilterProps {
  readonly filter: Partial<FilterText>;
  readonly onChange: (v: { label: string; value: FilterText["operator"] }) => void;
  readonly onValueChange: (v: string) => void;
}

export function TextFilterInput({ filter, onChange, onValueChange }: TextFilterProps) {
  const operator = filter.operator;

  const ref = useRef<HTMLInputElement>(null);

  const change: TextFilterProps["onChange"] = (v) => {
    onChange(v);
  };

  const config = cc.filter.use();
  const id = useId();

  return (
    <>
      <TextOperatorSelect filter={filter} onChange={change} />
      <Input
        small
        ref={ref}
        disabled={!operator}
        value={filter.value ?? ""}
        onChange={(e) => onValueChange(e.target.value)}
      />
      <label htmlFor={id} className="lng1771-sr-only">
        {config.simpleFilter?.labelText}
      </label>
    </>
  );
}
