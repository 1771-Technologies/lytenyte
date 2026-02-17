import { useControlled, useEvent } from "@1771technologies/lytenyte-core/internal";
import type { PivotState } from "./use-pivot-columns";
import { useMemo } from "react";

export type ControlledPivotState = ReturnType<typeof usePivotState>;

export function usePivotState(
  state: PivotState | undefined,
  onPivotStateChange: undefined | ((p: PivotState) => void),
) {
  const [pivotState, setPivotState] = useControlled({
    controlled: state,
    default: {
      columnState: { ordering: [], pinning: {}, resizing: {} },
      columnGroupState: {},
      rowGroupExpansions: {},
    },
  });

  const pivotColumnState = useMemo(() => pivotState.columnState, [pivotState.columnState]);
  const onPivotColumnStateChange = useEvent((change: PivotState["columnState"]) => {
    const next = { ...pivotState, columnState: change };
    setPivotState(next);
    onPivotStateChange?.(next);
  });

  const pivotGroupState = useMemo(() => pivotState.columnGroupState, [pivotState.columnGroupState]);
  const onPivotGroupStateChange = useEvent((change: PivotState["columnGroupState"]) => {
    const next = { ...pivotState, pivotGroupState: change };
    setPivotState(next);
    onPivotStateChange?.(next);
  });

  const pivotRowGroupExpansions = useMemo(
    () => pivotState.rowGroupExpansions,
    [pivotState.rowGroupExpansions],
  );
  const onPivotRowGroupChange = useEvent((change: PivotState["rowGroupExpansions"]) => {
    const next = { ...pivotState, rowGroupExpansions: change };
    setPivotState(next);
    onPivotStateChange?.(next);
  });

  return {
    state: pivotState,
    setState: setPivotState,
    pivotColumnState,
    onPivotColumnStateChange,
    pivotGroupState,
    onPivotGroupStateChange,
    pivotRowGroupExpansions,
    onPivotRowGroupChange,
  };
}
