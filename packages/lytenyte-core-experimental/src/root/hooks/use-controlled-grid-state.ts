import { useMemo } from "react";
import { useControlled } from "../../hooks/use-controlled.js";
import { useEvent } from "../../hooks/use-event.js";
import type { ColumnAbstract } from "@1771technologies/lytenyte-shared";
import type { Root } from "../root.js";

export type Controlled = ReturnType<typeof useControlledGridState>;

const EMPTY: any = {};
const EMPTY_SET = new Set();
const EMPTY_ARRAY: ColumnAbstract[] = [];
export function useControlledGridState(props: Root.Props) {
  // Column group expansion state
  const [columnGroupExpansions, setColumnGroupExpansions] = useControlled({
    controlled: props.columnGroupExpansions,
    default: EMPTY as Record<string, boolean>,
  });
  const onColumnGroupExpansionChange = useEvent((change: Record<string, boolean>) => {
    props.onColumnGroupExpansionChange?.(change);
    setColumnGroupExpansions(change);
  });

  // Row Detail expansion state
  const [detailExpansions, setDetailExpansions] = useControlled<Set<string>>({
    controlled: props.rowDetailExpansions,
    default: EMPTY_SET as Set<string>,
  });

  const onRowDetailExpansionsChange = useEvent((change: Set<string>) => {
    props.onRowDetailExpansionsChange?.(change);
    setDetailExpansions(change);
  });

  // Columns
  const [columns, setColumns] = useControlled({
    controlled: props.onColumnsChange ? props.columns : undefined,
    default: props.columns ?? (EMPTY_ARRAY as ColumnAbstract[]),
  });
  const onColumnsChange = useEvent((change: ColumnAbstract[]) => {
    props.onColumnsChange?.(change);
    setColumns(change);
  });

  const [rowGroupColumn, setRowGroupColumn] = useControlled({
    controlled: props.onRowGroupColumnChange ? props.rowGroupColumn : undefined,
    default: props.rowGroupColumn ?? (EMPTY as Omit<ColumnAbstract, "id" | "field">),
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
