import { createContext, useContext, type Dispatch, type SetStateAction } from "react";

export interface TreeViewRootContext {
  readonly panel: HTMLUListElement | null;
  readonly panelRef: Dispatch<SetStateAction<HTMLUListElement | null>>;

  readonly expansions: Record<string, boolean>;
  readonly onExpansionChange: (n: Record<string, boolean>) => void;
  readonly expansionDefault: boolean;

  readonly selectionMode: "single" | "multiple" | "none";
  readonly selection: Set<string>;
  readonly onSelectionChange: (c: Set<string>) => void;
  readonly selectionPivotRef: { current: string | null };

  readonly transitionEnterMs: number;
  readonly transitionExitMs: number;
  readonly gridWrappedBranches: boolean;

  // API Methods
  readonly onFocusChange: (el: HTMLElement | null) => void;
  readonly getAllIds: (panel: HTMLElement) => Set<string>;
  readonly getIdsBetweenNodes: (
    start: HTMLElement,
    end: HTMLElement,
    panel: HTMLElement,
  ) => string[];
}

export const context = createContext<TreeViewRootContext>({} as any);

export const useTreeRoot = () => useContext(context);
