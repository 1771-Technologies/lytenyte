import {
  createContext,
  useContext,
  type Dispatch,
  type PropsWithChildren,
  type ReactNode,
  type SetStateAction,
} from "react";
import type { ListViewAxe, ListViewItemRendererProps } from "./tree-view";

export interface ListViewContextType<D> {
  readonly count: number;
  readonly expansions: Record<string, boolean>;
  readonly axe: ListViewAxe<D>;
  readonly renderer: (p: ListViewItemRendererProps<D>) => ReactNode;
  readonly focused: number | null;
  readonly setFocused: Dispatch<SetStateAction<number | null>>;
}

const context = createContext<ListViewContextType<any>>({
  count: 0,
  expansions: {},
  axe: { axeItemLabels: () => "" } as unknown as ListViewAxe<any>,
  renderer: () => null,
  focused: null,
  setFocused: () => {},
});

export function ListViewProvider<D>(props: PropsWithChildren<{ value: ListViewContextType<D> }>) {
  return <context.Provider value={props.value}>{props.children}</context.Provider>;
}

export const useListView = () => useContext(context);
