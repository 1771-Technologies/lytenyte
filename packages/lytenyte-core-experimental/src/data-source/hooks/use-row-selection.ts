import { useControlled, useEvent } from "@1771technologies/lytenyte-core-experimental/internal";
import {
  rowSelectLinkWithoutParents,
  rowSelectLinkWithParents,
  type RowSelectionState,
  type RowSelectionStateWithParent,
} from "@1771technologies/lytenyte-shared";
import { useMemo } from "react";

export type SourceRowSelection = ReturnType<typeof useRowSelection>;

export function useRowSelection(
  userSelection: RowSelectionState | undefined,
  onRowSelectionChange: ((s: RowSelectionState) => void) | undefined,
  isolatedSelection: boolean,
) {
  const [rawSelections, setRawSelections] = useControlled<RowSelectionState>({
    controlled: userSelection,
    default: isolatedSelection
      ? { kind: "isolated", selected: false, exceptions: new Set() }
      : { kind: "controlled", selected: false, children: new Map() },
  });

  const rowSelectionState = useMemo<RowSelectionStateWithParent>(() => {
    if (isolatedSelection) {
      if (rawSelections.kind === "controlled")
        return { kind: "isolated", selected: false, exceptions: new Set() };
      return rawSelections;
    }
    return rowSelectLinkWithParents(rawSelections);
  }, [isolatedSelection, rawSelections]);

  const setSelected = useEvent(
    (
      s: RowSelectionStateWithParent | ((prev: RowSelectionStateWithParent) => RowSelectionStateWithParent),
    ) => {
      const nextState = typeof s === "function" ? s(rowSelectionState) : s;

      const without: RowSelectionState = isolatedSelection
        ? nextState.kind !== "isolated"
          ? { kind: "isolated", selected: false, exceptions: new Set() }
          : nextState
        : nextState.kind !== "controlled"
          ? { kind: "controlled", selected: false, children: new Map() }
          : rowSelectLinkWithoutParents(nextState);

      setRawSelections(without);
      onRowSelectionChange?.(without);
    },
  );

  return {
    rawSelections,
    rowSelectionState,
    rowSelectionSet: setSelected,
  };
}
