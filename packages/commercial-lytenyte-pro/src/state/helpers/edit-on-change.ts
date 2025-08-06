import type { InternalAtoms } from "../+types";
import type { Column, ColumnBase, Grid, RowNode } from "../../+types";

interface EditOnChangeArgs<T> {
  readonly column: Column<T>;
  readonly base: ColumnBase<T>;
  readonly activeData: any;
  readonly row: RowNode<T>;
  readonly value: any;
  readonly grid: Grid<T> & { internal: InternalAtoms };
  readonly rowIndex: number;
}
export function editOnChange<T>({
  value: c,
  grid,
  rowIndex,
  column,
  base,
  row,
  activeData,
}: EditOnChangeArgs<T>) {
  const field = column.field ?? column.id;

  let next = structuredClone(activeData);
  if (row.kind !== "branch" && typeof field === "number") next[field] = c;
  else if (row.kind !== "branch" && typeof field === "string") next[field] = c;
  else {
    const setter = column.editSetter ?? base.editSetter;

    if (!setter) {
      console.error(
        "A column with a non-trivial field must provide a corresponding editSetter to be editable.",
      );
      return;
    }

    next = setter({
      column,
      data: next,
      grid: grid,
      row,
      rowIndex,
    });
  }

  const validator = grid.state.editRowValidatorFn.get();
  const result = validator.fn({ grid: grid, rowIndex: rowIndex, data: next, row });

  grid.internal.editData.set(next);
  grid.internal.editValidation.set(result);
}
