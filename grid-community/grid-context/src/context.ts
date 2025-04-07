import type { GridCoreReact } from "@1771technologies/grid-types/core-react";
import type { GridProReact } from "@1771technologies/grid-types/pro-react";
import { createContext } from "react";

export const context = createContext<GridCoreReact<any> | GridProReact<any>>({} as any);
