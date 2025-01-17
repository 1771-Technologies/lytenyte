import type { FilterText } from "@1771technologies/grid-types/community";
import { TextOperatorSelect } from "./text-operator-select";
import { useRef } from "react";
import { Input } from "../../../input/Input";

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

  return (
    <>
      <TextOperatorSelect filter={filter} onChange={change} />
      <Input
        small
        inputRef={ref}
        disabled={!operator}
        value={filter.value ?? ""}
        onChange={(e) => onValueChange(e.target.value)}
      />
    </>
  );
}
