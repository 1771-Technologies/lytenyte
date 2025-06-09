import { useMemo, useRef, useState, type PropsWithChildren } from "react";
import { context, type TreeViewRootContext } from "./context";

export interface TreeRootProps {
  readonly transitionEnter?: number;
  readonly transitionExit?: number;
  readonly gridWrappedBranches?: boolean;

  readonly expansions?: Record<string, boolean>;
  readonly onExpansionChange?: (n: Record<string, boolean>) => void;

  readonly selectMode?: "single" | "multiple" | "none";
  readonly selection?: Set<string>;
  readonly onSelectionChange?: (c: Set<string>) => void;
}

export const TreeRoot = (p: PropsWithChildren<TreeRootProps>) => {
  const [panel, setPanel] = useState<HTMLUListElement | null>(null);
  const [expansions, onExpansionChange] = useState<Record<string, boolean>>({});
  const [selection, setSelections] = useState<Set<string>>(() => new Set());

  const selectionPivotRef = useRef<string | null>(null);

  const value = useMemo<TreeViewRootContext>(() => {
    return {
      panel,
      panelRef: setPanel,
      selectionMode: p.selectMode ?? "single",
      transitionEnterMs: p.transitionEnter ?? 0,
      transitionExitMs: p.transitionExit ?? 0,
      gridWrappedBranches: p.gridWrappedBranches ?? false,
      expansions: p.expansions ?? expansions,
      onExpansionChange: p.onExpansionChange ?? onExpansionChange,
      selection: p.selection ?? selection,
      onSelectionChange: p.onSelectionChange ?? setSelections,
      selectionPivotRef,
    };
  }, [
    expansions,
    p.expansions,
    p.gridWrappedBranches,
    p.onExpansionChange,
    p.onSelectionChange,
    p.selectMode,
    p.selection,
    p.transitionEnter,
    p.transitionExit,
    panel,
    selection,
  ]);

  return <context.Provider value={value}>{p.children}</context.Provider>;
};
