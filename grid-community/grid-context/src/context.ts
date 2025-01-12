import type { StoreCommunityReact, StoreEnterpriseReact } from "@1771technologies/grid-types";
import { createContext } from "react";

export const context = createContext<StoreEnterpriseReact<any> | StoreCommunityReact<any>>(
  {} as any,
);
