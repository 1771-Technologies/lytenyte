import {
  createServerDataSource,
  type ServerDataSourceInitial,
} from "@1771technologies/grid-server-data-source";
import { useState, type ReactNode } from "react";

export function useServerDataSource<D>(init: ServerDataSourceInitial<D, ReactNode>) {
  const [ds] = useState(() => {
    return createServerDataSource(init);
  });

  return ds;
}
