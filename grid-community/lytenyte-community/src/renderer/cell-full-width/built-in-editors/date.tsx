export function DateEditor<D>({ value, setValue, isValid, column }: CellEditProviderParams<D>) {
  const opts = column.cellEditParams ?? {};

  return (
    <Input
      type="date"
      className="lng1771-cell-editor-date"
      error={!isValid}
      min={opts.min}
      max={opts.max}
      value={String(value)}
      onChange={(event) => setValue(event.target.value)}
    />
  );
}
