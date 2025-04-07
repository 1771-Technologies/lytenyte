import {
  createContext,
  useContext,
  type CSSProperties,
  type Dispatch,
  type PropsWithChildren,
  type ReactNode,
  type SetStateAction,
} from "react";
import type { ListViewItemRendererProps } from "./list-view.js";
import type { PathTreeLeafNode, PathTreeParentNode } from "@1771technologies/path-tree";

export interface ListViewContextType<D> {
  readonly count: number;
  readonly expansions: Record<string, boolean>;
  readonly renderer: (p: ListViewItemRendererProps<D>) => ReactNode;
  readonly focused: number | null;
  readonly setFocused: Dispatch<SetStateAction<number | null>>;
  readonly rtl: boolean;
  readonly onExpansionChange: (id: string, state: boolean) => void;
  readonly onAction: (p: PathTreeLeafNode<D> | PathTreeParentNode<D>) => void;
  readonly onKeydown?: (
    ev: KeyboardEvent,
    item: PathTreeLeafNode<D> | PathTreeParentNode<D>,
  ) => void;
  readonly className?: string;
  readonly itemStyle?: CSSProperties;
  readonly itemClassName?: string;
}

const context = createContext<ListViewContextType<any>>({
  count: 0,
  expansions: {},
  renderer: () => null,
  focused: null,
  setFocused: () => {},
  rtl: false,
  onExpansionChange: () => {},
  onAction: () => {},
});

export function ListViewProvider<D>(props: PropsWithChildren<{ value: ListViewContextType<D> }>) {
  return <context.Provider value={props.value}>{props.children}</context.Provider>;
}

export const useListView = () => useContext(context);
