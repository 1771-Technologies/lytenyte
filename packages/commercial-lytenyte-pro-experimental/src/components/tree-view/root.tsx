import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useState,
  type ReactNode,
  type Ref,
} from "react";
import { Grid, useClientDataSource } from "../../index.js";
import type { RowGroup, RowLeaf, RowSelectionLinked } from "@1771technologies/lytenyte-shared";
import { TreeChildren } from "./tree-children.js";
import type { TreeViewChildParams, TreeViewItem, TreeViewSelectAllParams } from "./types.js";
import { SelectAll } from "./select-all.js";

export interface TreeViewProps<T extends TreeViewItem> {
  readonly items: T[];
  readonly children?: (props: TreeViewChildParams<T>) => ReactNode;

  readonly renderSelectAll?: (params: TreeViewSelectAllParams) => ReactNode;
  readonly rowHeight?: number;
  readonly defaultExpansion?: boolean | number;

  readonly branchJoinSeparator?: string;
  readonly rowSelectAllShow?: boolean;
  readonly rowSelectionEnabled?: boolean;
  readonly rowSelection?: RowSelectionLinked;
  readonly onRowSelectionChange?: (selection: RowSelectionLinked) => void;

  readonly rowGroupExpansions?: Record<string, boolean | undefined>;
  readonly onRowGroupExpansionChange?: (change: Record<string, boolean | undefined>) => void;
}

export interface TreeViewApi<T extends TreeViewItem> {
  readonly rowsSelected: () => (RowLeaf<T> | RowGroup)[];
}

function TreeViewBase<T extends TreeViewItem>(
  {
    items,
    rowSelectAllShow: rowSelectAll = true,
    defaultExpansion,
    rowHeight = 28,
    children = TreeChildren,

    branchJoinSeparator = "/",
    rowSelectionEnabled = true,
    rowSelection,
    onRowSelectionChange,

    rowGroupExpansions,
    onRowGroupExpansionChange,
  }: TreeViewProps<T>,
  forwarded: Ref<TreeViewApi<T>>,
) {
  type Spec = { data: T };

  const groupFn: Grid.T.GroupFn<Spec["data"]> = useMemo(() => {
    return (x: RowLeaf<T>) => x.data.path;
  }, []);

  const finalItems = useMemo(() => {
    if (!rowSelectAll) return items;
    return [{ id: "__ln_select_all", path: [], name: "Select All" } as unknown as T, ...items];
  }, [items, rowSelectAll]);

  const subtractions = useMemo(() => {
    if (rowSelectAll) return new Set(["__ln_select_all"]);

    return new Set<string>();
  }, [rowSelectAll]);

  const source = useClientDataSource<Spec>({
    group: groupFn,
    data: finalItems,
    rowGroupDefaultExpansion: defaultExpansion ?? false,

    leafIdFn: useCallback((d: T) => d.id, []),
    groupIdFn: useCallback((p: (string | null)[]) => p.join(branchJoinSeparator), [branchJoinSeparator]),

    rowGroupExpansions,
    onRowGroupExpansionChange,

    rowSelectionIdUniverseSubtractions: subtractions,
    rowSelection,
    onRowSelectionChange: onRowSelectionChange as any,
  });

  const [api, setApi] = useState<Grid.API<Spec> | null>(null);
  const groupColumn: Grid.RowGroupColumn<Spec> = useMemo(() => {
    return {
      widthFlex: 1,
      width: 20,
      widthMin: 20,

      cellRenderer: ({ row, api, indeterminate, selected }) => {
        if (row.kind === "aggregated") return null;

        if (row.id === "__ln_select_all") {
          if (!api) return null;
          return <SelectAll api={api as any} />;
        }

        return children({
          row,
          selectEnabled: rowSelectionEnabled,
          selected,
          indeterminate,
          select: (b?: boolean) => api.rowSelect({ selected: row.id, deselect: !(b ?? selected) }),
          handleSelect: api.rowHandleSelect,
          toggle: (b?: boolean) => api.rowGroupToggle(row.id, b),
        });
      },
    };
  }, [children, rowSelectionEnabled]);

  useImperativeHandle(forwarded, () => {
    return {
      rowsSelected: () =>
        (api?.rowsSelected().rows ?? []).filter((x) => x.id !== "__ln_select_all") as (
          | RowLeaf<T>
          | RowGroup
        )[],
    };
  }, [api]);

  return (
    <Grid
      ref={setApi}
      rowSource={source}
      rowGroupColumn={groupColumn}
      rowAlternateAttr={false}
      headerHeight={0}
      rowHeight={rowHeight}
      rowSelectionMode={rowSelectionEnabled ? "multiple" : "none"}
      rowSelectionActivator="none"
      events={useMemo<Grid.Events<Spec>>(() => {
        return {
          cell: {
            keyDown: ({ api, event, row }) => {
              if (event.key === " " && row.kind === "branch") {
                event.preventDefault();
                api.rowGroupToggle(row.id);
              }
              if (event.key === "ArrowLeft" && row.kind === "branch") {
                event.preventDefault();
                event.stopPropagation();
                api.rowGroupToggle(row.id, false);
              }
              if (event.key === "ArrowRight" && row.kind === "branch") {
                event.preventDefault();
                event.stopPropagation();
                api.rowGroupToggle(row.id, true);
              }

              if (event.key === "Enter") {
                api.rowSelect({ selected: row.id, deselect: api.rowIsSelected(row.id) });
              }
            },
          },
        };
      }, [])}
      styles={useMemo(() => {
        return {
          viewport: {
            className: "ln-tree-view",
          },
        };
      }, [])}
    >
      <Grid.Viewport>
        <Grid.RowsContainer>
          <Grid.RowsCenter />
        </Grid.RowsContainer>
      </Grid.Viewport>
    </Grid>
  );
}

export const TreeView = forwardRef(TreeViewBase);
