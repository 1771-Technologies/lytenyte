import "./number.css";
import type { CellEditProviderParams } from "@1771technologies/grid-types-react";
import { Input } from "@1771technologies/lng-component-react-input";

export function NumberEditor<D>({ value, setValue, isValid, column }: CellEditProviderParams<D>) {
  const opts = column.cellEditParams ?? {};
  return (
    <Input
      type="number"
      min={opts.min}
      max={opts.max}
      step={opts.step}
      error={!isValid}
      className="lng1771-cell-editor-number"
      value={`${value ?? ""}`}
      onChange={(event) => setValue(Number.parseFloat(event.target.value))}
    />
  );
}
