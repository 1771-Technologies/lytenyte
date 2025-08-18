import { createContext, useContext } from "react";
import type { Column } from "../+types";
import type { PathBranch, PathLeaf } from "@1771technologies/lytenyte-shared";

export interface TreeItemContextValue {
  readonly item: PathBranch<Column<any>> | PathLeaf<Column<any>>;
}

export const ColumnItemContext = createContext<TreeItemContextValue>(null as any);

export const useColumnItemContext = () => useContext(ColumnItemContext);
