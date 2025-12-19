import { useMemo } from "react";
import { useControlled } from "../../hooks/use-controlled.js";
import { useEvent } from "../../hooks/use-event.js";
import type { Props } from "../../types/props.js";

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

  return useMemo(() => {
    return {
      columnGroupExpansions,
      onColumnGroupExpansionChange,

      detailExpansions,
      onRowDetailExpansionsChange,
    };
  }, [columnGroupExpansions, detailExpansions, onColumnGroupExpansionChange, onRowDetailExpansionsChange]);
}
