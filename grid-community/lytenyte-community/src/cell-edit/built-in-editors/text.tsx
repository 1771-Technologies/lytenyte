import type { CellEditProviderParamsCoreReact } from "@1771technologies/grid-types/core-react";
import { Input } from "../../components/Input";

export function TextEditor<D>({
  value,
  setValue,
  isValid,
  column,
}: CellEditProviderParamsCoreReact<D>) {
  const opts = column.cellEditParams ?? {};
  return (
    <Input
      error={!isValid}
      maxLength={opts.maxLength}
      className="lng1771-cell__edit-input"
      value={`${value as string}`}
      onChange={(event) => setValue(event.target.value)}
    />
  );
}
