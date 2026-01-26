import type { Column, GridSpec } from "../../../../types/index.js";

const omitKeys = [
  "id",
  "name",
  "groupVisibility",
  "groupPath",
  "pin",
  "hide",
  "field",
  "colSpan",
  "rowSpan",
  "editOnPrintable",
  "editRenderer",
  "editable",
  "editSetter",
];

export function applyReferenceColumn<Spec extends GridSpec>(
  pivotColumn: Column<Spec>,
  reference: Omit<Column<Spec>, "id"> | undefined,
) {
  if (!reference) return pivotColumn;

  const final = Object.fromEntries(Object.entries(reference).filter((x) => !omitKeys.includes(x[0])));

  Object.assign(pivotColumn, final);

  return pivotColumn;
}
