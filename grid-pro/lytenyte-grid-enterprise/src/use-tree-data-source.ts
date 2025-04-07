import {
  createTreeDataSource,
  type TreeDataSourceInitial,
} from "@1771technologies/grid-tree-data-source";
import { useState, type ReactNode } from "react";

export function useTreeDataSource<D>(init: TreeDataSourceInitial<D, ReactNode>) {
  const [ds] = useState(() => {
    return createTreeDataSource(init);
  });

  return ds;
}
