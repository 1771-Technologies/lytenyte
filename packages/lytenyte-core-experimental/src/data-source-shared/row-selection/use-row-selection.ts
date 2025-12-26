import { useControlled, useEvent } from "@1771technologies/lytenyte-core-experimental/internal";
import {
  rowSelectLinkWithoutParents,
  rowSelectLinkWithParents,
  type RowSelectionState,
  type RowSelectionStateWithParent,
} from "@1771technologies/lytenyte-shared";
import { useEffect, useMemo, useRef, type Dispatch, type SetStateAction } from "react";

export type SourceRowSelection = {
  readonly rowSelectionsRaw: RowSelectionState;
  readonly rowSelections: RowSelectionStateWithParent;
  readonly rowSelectionsSet: Dispatch<SetStateAction<RowSelectionStateWithParent>>;
};

export function useRowSelection(
  userSelection: RowSelectionState | undefined,
  onRowSelectionChange: ((s: RowSelectionState) => void) | undefined,
  isolatedSelection: boolean,
) {
  const [rowSelectionsRaw, setRowSelectionsRaw] = useControlled<RowSelectionState>({
    controlled: userSelection,
    default: isolatedSelection
      ? { kind: "isolated", selected: false, exceptions: new Set() }
      : { kind: "controlled", selected: false, children: new Map() },
  });

  const rowSelections = useMemo<RowSelectionStateWithParent>(() => {
    if (isolatedSelection) {
      if (rowSelectionsRaw.kind === "controlled")
        return { kind: "isolated", selected: false, exceptions: new Set() };
      return rowSelectionsRaw;
    }
    return rowSelectLinkWithParents(rowSelectionsRaw);
  }, [isolatedSelection, rowSelectionsRaw]);

  const prevIsolated = useRef(isolatedSelection);
  useEffect(() => {
    if (prevIsolated.current === isolatedSelection) return;

    prevIsolated.current = isolatedSelection;
    setRowSelectionsRaw(
      isolatedSelection
        ? { kind: "isolated", selected: false, exceptions: new Set() }
        : { kind: "controlled", selected: false, children: new Map() },
    );
  }, [isolatedSelection, setRowSelectionsRaw]);

  const rowSelectionsSet = useEvent(
    (
      s: RowSelectionStateWithParent | ((prev: RowSelectionStateWithParent) => RowSelectionStateWithParent),
    ) => {
      const nextState = typeof s === "function" ? s(rowSelections) : s;

      const without: RowSelectionState = isolatedSelection
        ? nextState.kind !== "isolated"
          ? { kind: "isolated", selected: false, exceptions: new Set() }
          : nextState
        : nextState.kind !== "controlled"
          ? { kind: "controlled", selected: false, children: new Map() }
          : rowSelectLinkWithoutParents(nextState);

      setRowSelectionsRaw(without);
      onRowSelectionChange?.(without);
    },
  );

  const selectionRef = useRef({} as SourceRowSelection);
  Object.assign(selectionRef.current, {
    rowSelectionsRaw,
    rowSelections,
    rowSelectionsSet,
  });

  return selectionRef.current;
}
