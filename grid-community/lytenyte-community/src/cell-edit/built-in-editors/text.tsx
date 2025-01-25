import type { CellEditProviderParamsReact } from "@1771technologies/grid-types/community-react";
import { Input } from "../../components/Input";

export function TextEditor<D>({
  value,
  setValue,
  isValid,
  column,
}: CellEditProviderParamsReact<D>) {
  const opts = column.cellEditParams ?? {};
  return (
    <Input
      error={!isValid}
      maxLength={opts.maxLength}
      className={css`
        width: calc(100% - 8px);
        height: calc(100% - 8px);
        padding: 0px;
        position: relative;
        inset-inline-start: 4px;
        top: 4px;
        border-radius: 0px;
      `}
      value={`${value as string}`}
      onChange={(event) => setValue(event.target.value)}
    />
  );
}
