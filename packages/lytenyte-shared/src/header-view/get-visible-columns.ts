interface HidableColumn {
  readonly hide?: boolean;
}

export function getVisibleColumns<Hidable extends HidableColumn, Base extends HidableColumn>(
  c: Hidable[],
  b: Base,
): Hidable[] {
  const visible: Hidable[] = [];

  for (let i = 0; i < c.length; i++) if (!(c[i].hide ?? b.hide)) visible.push(c[i]);

  return visible;
}
