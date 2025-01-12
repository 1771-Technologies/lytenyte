import type { StoreEnterpriseReact } from "@1771technologies/grid-types";
import { useContext, type PropsWithChildren } from "react";
import { context } from "@1771technologies/grid-provider";

export const GridProvider = (props: PropsWithChildren<{ grid: StoreEnterpriseReact<any> }>) => {
  return <context.Provider value={props.grid}>{props.children}</context.Provider>;
};

export const useGrid = () => useContext(context) as StoreEnterpriseReact<any>;
