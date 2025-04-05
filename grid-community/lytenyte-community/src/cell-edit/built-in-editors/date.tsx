import type { CellEditProviderParamsReact } from "@1771technologies/grid-types/core-react";
import { Input } from "../../components/Input.js";

export function DateEditor<D>({
  value,
  setValue,
  isValid,
  column,
}: CellEditProviderParamsReact<D>) {
  const opts = column.cellEditParams ?? {};

  return (
    <Input
      type="date"
      className="lng1771-cell__edit-input"
      error={!isValid}
      min={opts.min}
      max={opts.max}
      value={String(value)}
      onChange={(event) => setValue(event.target.value)}
    />
  );
}
