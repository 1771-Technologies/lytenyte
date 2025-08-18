import { forwardRef, useMemo, useRef, useState, type PropsWithChildren, type Ref } from "react";
import { context, type TreeViewRootContext } from "./context";
import { useCombinedRefs, useEvent } from "@1771technologies/lytenyte-react-hooks";
import { getAllIds } from "./navigation/get-all-ids.js";
import { getIdsBetweenNodes } from "./utils/get-ids-between-nodes.js";

export interface TreeRootProps {
  readonly transitionEnter?: number;
  readonly transitionExit?: number;
  readonly gridWrappedBranches?: boolean;

  readonly expansions?: Record<string, boolean>;
  readonly expansionDefault?: boolean;
  readonly onExpansionChange?: (n: Record<string, boolean>) => void;

  readonly selectMode?: "single" | "multiple" | "none";
  readonly selection?: Set<string>;
  readonly onSelectionChange?: (c: Set<string>) => void;

  readonly onFocusChange?: (el: HTMLElement | null) => void;
  readonly getAllIds?: (panel: HTMLElement) => Set<string>;
  readonly getIdsBetweenNodes?: (
    start: HTMLElement,
    end: HTMLElement,
    panel: HTMLElement,
  ) => string[];

  readonly ref?: Ref<HTMLElement | null>;
}

export const TreeRoot = forwardRef<HTMLElement, PropsWithChildren<TreeRootProps>>(
  (p, forwarded) => {
    const [panel, setPanel] = useState<HTMLUListElement | null>(null);
    const [expansions, onExpansionChange] = useState<Record<string, boolean>>({});
    const [selection, setSelections] = useState<Set<string>>(() => new Set());

    const ref = useCombinedRefs(setPanel, forwarded as any);
    const selectionPivotRef = useRef<string | null>(null);

    const allIds = useEvent((el) => {
      if (p.getAllIds) return p.getAllIds(el);
      return getAllIds(el);
    });
    const idsBetween = useEvent((left: HTMLElement, right: HTMLElement, panel: HTMLElement) => {
      if (p.getIdsBetweenNodes) return p.getIdsBetweenNodes(left, right, panel);

      return getIdsBetweenNodes(left, right, panel);
    });

    const onFocusChange = useEvent((el: HTMLElement | null) => {
      p.onFocusChange?.(el);
    });

    const value = useMemo<TreeViewRootContext>(() => {
      return {
        panel,
        panelRef: ref as any,
        selectionMode: p.selectMode ?? "single",
        transitionEnterMs: p.transitionEnter ?? 0,
        transitionExitMs: p.transitionExit ?? 0,
        gridWrappedBranches: p.gridWrappedBranches ?? false,
        expansions: p.expansions ?? expansions,
        onExpansionChange: p.onExpansionChange ?? onExpansionChange,
        selection: p.selection ?? selection,
        onSelectionChange: p.onSelectionChange ?? setSelections,
        selectionPivotRef,
        expansionDefault: p.expansionDefault ?? false,

        onFocusChange,
        getAllIds: allIds,
        getIdsBetweenNodes: idsBetween,
      };
    }, [
      allIds,
      expansions,
      idsBetween,
      onFocusChange,
      p.expansionDefault,
      p.expansions,
      p.gridWrappedBranches,
      p.onExpansionChange,
      p.onSelectionChange,
      p.selectMode,
      p.selection,
      p.transitionEnter,
      p.transitionExit,
      panel,
      ref,
      selection,
    ]);

    return <context.Provider value={value}>{p.children}</context.Provider>;
  },
);
