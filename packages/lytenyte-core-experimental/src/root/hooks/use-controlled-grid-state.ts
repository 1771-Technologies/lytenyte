import { useMemo } from "react";
import { useControlled } from "../../hooks/use-controlled.js";
import { useEvent } from "../../hooks/use-event.js";
import type { Props } from "../../types/types-internal.js";
import type { ColumnAbstract } from "@1771technologies/lytenyte-shared";

export type Controlled = ReturnType<typeof useControlledGridState>;

export function useControlledGridState(props: Props) {
  // Column group expansion state
  const [columnGroupExpansions, setColumnGroupExpansions] = useControlled({
    controlled: props.columnGroupExpansions,
    default: {},
  });
  const onColumnGroupExpansionChange = useEvent((change: Record<string, boolean>) => {
    props.onColumnGroupExpansionChange?.(change);
    setColumnGroupExpansions(change);
  });

  // Row Detail expansion state
  const [detailExpansions, setDetailExpansions] = useControlled<Set<string>>({
    controlled: props.rowDetailExpansions,
    default: new Set(),
  });

  const onRowDetailExpansionsChange = useEvent((change: Set<string>) => {
    props.onRowDetailExpansionsChange?.(change);
    setDetailExpansions(change);
  });

  // Columns
  const [columns, setColumns] = useControlled({
    controlled: props.onColumnsChange ? props.columns : undefined,
    default: props.columns,
  });
  const onColumnsChange = useEvent((change: ColumnAbstract[]) => {
    props.onColumnsChange?.(change);
    setColumns(change);
  });

  const [rowGroupColumn, setRowGroupColumn] = useControlled({
    controlled: props.onRowGroupColumnChange ? props.rowGroupColumn : undefined,
    default: props.rowGroupColumn,
  });
  const onRowGroupColumnChange = useEvent((change: Omit<ColumnAbstract, "id" | "field">) => {
    delete (change as any)["id"];
    delete (change as any)["field"];

    props.onRowGroupColumnChange?.(change);
    setRowGroupColumn(change);
  });

  return useMemo(() => {
    return {
      columnGroupExpansions,
      onColumnGroupExpansionChange,

      detailExpansions,
      onRowDetailExpansionsChange,

      columns,
      onColumnsChange,

      rowGroupColumn,
      onRowGroupColumnChange,
    };
  }, [
    columnGroupExpansions,
    columns,
    detailExpansions,
    onColumnGroupExpansionChange,
    onColumnsChange,
    onRowDetailExpansionsChange,
    onRowGroupColumnChange,
    rowGroupColumn,
  ]);
}
