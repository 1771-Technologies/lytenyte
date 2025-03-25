import { clsx } from "@1771technologies/js-utils";
import { useMemo, type ReactNode } from "react";
import { useGrid } from "../use-grid";
import { useColumnManagerState } from "./column-manager-state";
import { ListView, type ListViewItemRendererProps } from "../list-view/list-view";
import type { ColumnEnterpriseReact } from "@1771technologies/grid-types";
import { handleItemHide } from "./utils/handle-item-hide";

interface ColumnManagerTreeProps<D> {
  children: (p: ListViewItemRendererProps<ColumnEnterpriseReact<D>>) => ReactNode;
  itemHeight?: number;
  className?: string;
  itemClassName?: string;
}

export function ColumnManagerTree<D>({
  className,
  itemClassName,
  children,
  itemHeight = 30,
}: ColumnManagerTreeProps<D>) {
  const { api, state } = useGrid();

  const columns = state.columns.use();
  const expansions = state.internal.columnManagerTreeExpansions.use();
  const { query } = useColumnManagerState();

  const paths = useMemo(() => {
    const paths = columns
      .filter((c) => {
        if (api.columnIsGridGenerated(c) && !api.columnIsGroupAutoColumn(c)) return false;

        if (!query) return true;

        const label = c.headerName ?? c.id;
        return label.toLowerCase().includes(query.toLocaleLowerCase());
      })
      .map((c) => ({ path: c.groupPath ?? [], data: c }));

    return paths;
  }, [api, columns, query]);

  return (
    <ListView
      expansions={expansions}
      className={clsx("lng1771-column-manager__tree", className)}
      itemClassName={clsx("lng1771-column-manager__tree-item-wrapper", itemClassName)}
      paths={paths}
      itemHeight={itemHeight}
      renderer={children}
      onAction={(item) => handleItemHide(item, api)}
      onExpansionChange={(id, s) => {
        state.internal.columnManagerTreeExpansions.set((prev) => ({ ...prev, [id]: s }));
      }}
    />
  );
}
