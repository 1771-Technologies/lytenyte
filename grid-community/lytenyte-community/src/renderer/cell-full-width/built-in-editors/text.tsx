import type { CellEditProviderParams } from "@1771technologies/grid-types-react";
import "./text.css";
import { Input } from "@1771technologies/lng-component-react-input";

export function TextEditor<D>({ value, setValue, isValid, column }: CellEditProviderParams<D>) {
  const opts = column.cellEditParams ?? {};
  return (
    <Input
      error={!isValid}
      maxLength={opts.maxLength}
      className="lng1771-cell-editor-text"
      value={`${value as string}`}
      onChange={(event) => setValue(event.target.value)}
    />
  );
}
