import { createContext, useContext, type JSX, type ReactNode } from "react";
import type { PillManagerAggMenuProps } from "../pill-manager/pill-manager-agg-menu";

const context = createContext<{
  readonly aggMenuRenderer: (p: PillManagerAggMenuProps<any>) => ReactNode;
  readonly measureMenuRenderer: (p: PillManagerAggMenuProps<any>) => ReactNode;
  readonly menuTriggerIcon: (p: JSX.IntrinsicElements["svg"]) => ReactNode;
}>({} as any);

export const useComponents = () => useContext(context);

export const ColumnMangerContextProvider = context.Provider;
