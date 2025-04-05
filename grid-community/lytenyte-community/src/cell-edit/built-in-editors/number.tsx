import type { CellEditProviderParamsReact } from "@1771technologies/grid-types/core-react";
import { Input } from "../../components/Input";

export function NumberEditor<D>({
  value,
  setValue,
  isValid,
  column,
}: CellEditProviderParamsReact<D>) {
  const opts = column.cellEditParams ?? {};
  return (
    <Input
      type="number"
      min={opts.min}
      max={opts.max}
      step={opts.step}
      error={!isValid}
      className="lng1771-cell__edit-input"
      value={`${value ?? ""}`}
      onChange={(event) => setValue(Number.parseFloat(event.target.value))}
    />
  );
}
