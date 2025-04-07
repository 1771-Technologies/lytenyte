import { clsx } from "@1771technologies/js-utils";
import { useMemo, type ReactNode } from "react";
import { useGrid } from "../use-grid";
import { useColumnManagerState } from "./column-manager-state";
import { ListView, type ListViewItemRendererProps } from "../list-view/list-view";
import { handleItemHide } from "./utils/handle-item-hide";
import { useDrag, useDragStore } from "@1771technologies/lytenyte-core/internal";
import type { ColumnProReact } from "../types";

interface ColumnManagerTreeProps<D> {
  children: (p: ListViewItemRendererProps<ColumnProReact<D>>) => ReactNode;
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

        const searchLabel = [c.headerName ?? c.id, ...(c.groupPath ?? [])].join(" ");
        return searchLabel.toLowerCase().includes(query.toLocaleLowerCase());
      })
      .map((c) => ({ path: c.groupPath ?? [], data: c }));

    return paths;
  }, [api, columns, query]);

  const dragStore = useDragStore();
  const edgeScroll = useDrag(dragStore, (d) => !!d.active);

  return (
    <ListView
      edgeScrollActive={edgeScroll}
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
