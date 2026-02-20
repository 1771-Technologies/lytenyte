import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useState,
  type ReactNode,
  type Ref,
} from "react";
import {
  itemsWithIdToMap,
  moveRelative,
  type GroupFn,
  type RowGroup,
  type RowLeaf,
  type RowSelectionLinked,
} from "@1771technologies/lytenyte-shared";
import { TreeChildren } from "./tree-children.js";
import type { TreeViewChildParams, TreeViewItem, TreeViewSelectAllParams } from "./types.js";
import { SelectAll } from "./select-all.js";
import { useClientDataSource } from "../../data-source-client/use-client-data-source.js";
import type { Column } from "../../types/column.js";
import type { API } from "../../types/api.js";
import { usePiece } from "@1771technologies/lytenyte-core/internal";
import { Root } from "../../root/root.js";
import type { GridEvents } from "../../types/events.js";
import { Grid } from "@1771technologies/lytenyte-core";

export interface TreeViewProps<T extends TreeViewItem> {
  readonly items: T[];
  readonly children?: (props: TreeViewChildParams<T>) => ReactNode;

  readonly selectAllSlot?: (params: TreeViewSelectAllParams) => ReactNode;
  readonly rowHeight?: number;
  readonly defaultExpansion?: boolean | number;

  readonly branchJoinSeparator?: string;
  readonly rowSelectAllShow?: boolean;
  readonly rowSelectionEnabled?: boolean;
  readonly rowSelection?: RowSelectionLinked;
  readonly onRowSelectionChange?: (selection: RowSelectionLinked) => void;

  readonly rowGroupExpansions?: Record<string, boolean | undefined>;
  readonly onRowGroupExpansionChange?: (change: Record<string, boolean | undefined>) => void;

  /**
   * @alpha
   * @internal
   *
   * Do not use this property unless you know what you are doing. Support for tree view drag
   * and drag is still being prototyped.
   */
  readonly draggable?: boolean;
  /**
   * @alpha
   * @internal
   *
   * Do not use this property unless you know what you are doing. Support for tree view drag
   * and drag is still being prototyped.
   */
  readonly onItemsReordered?: (items: T[]) => void;
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
    selectAllSlot,

    draggable,
    onItemsReordered,
  }: TreeViewProps<T>,
  forwarded: Ref<TreeViewApi<T>>,
) {
  type Spec = { data: T };

  const groupFn: GroupFn<Spec["data"]> = useMemo(() => {
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

    sort: null,
    leafIdFn: useCallback((d: T) => d.id, []),
    groupIdFn: useCallback((p: (string | null)[]) => p.join(branchJoinSeparator), [branchJoinSeparator]),

    rowGroupExpansions,
    onRowGroupExpansionChange,

    rowSelectionIdUniverseSubtractions: subtractions,
    rowSelection,
    onRowSelectionChange: onRowSelectionChange as any,
  });

  const [overId, setOverId] = useState<string | null>(null);
  const [isBefore, setIsBefore] = useState<boolean>(false);

  const itemLookup = useMemo(() => itemsWithIdToMap(items), [items]);

  const over$ = usePiece(overId);
  const isBefore$ = usePiece(isBefore);

  const [api, setApi] = useState<API<Spec> | null>(null);
  const groupColumn: Omit<Column<Spec>, "id"> = useMemo(() => {
    return {
      widthFlex: 1,
      width: 20,
      widthMin: 20,

      cellRenderer: ({ row, rowIndex, api, indeterminate, selected }) => {
        const { props, isDragActive } = api.useRowDrag({
          rowIndex,
        });
        const over = over$.useValue();
        const isBefore = isBefore$.useValue();

        if (row.kind === "aggregated") return null;

        if (row.id === "__ln_select_all") {
          if (!api) return null;
          return <SelectAll api={api as any} render={selectAllSlot} />;
        }

        const leafs = () =>
          row.kind === "branch"
            ? api.rowLeafs(row.id).map((x) => itemLookup.get(x)!)
            : [itemLookup.get(row.id)!];

        return children({
          row,
          leafs,
          selectEnabled: rowSelectionEnabled,
          selected,
          indeterminate,
          select: (b?: boolean) => api.rowSelect({ selected: row.id, deselect: !(b ?? selected) }),
          handleSelect: api.rowHandleSelect,
          toggle: (b?: boolean) => api.rowGroupToggle(row.id, b),
          dragProps: draggable ? props : {},
          isBefore: isBefore,
          isOver: !isDragActive && row.id === over,
        });
      },
    };
  }, [children, draggable, isBefore$, itemLookup, over$, rowSelectionEnabled, selectAllSlot]);

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
    <Root
      ref={setApi}
      rowSource={source}
      rowGroupColumn={groupColumn}
      rowAlternateAttr={false}
      headerHeight={0}
      rowHeight={rowHeight}
      rowSelectionMode={rowSelectionEnabled ? "multiple" : "none"}
      rowSelectionActivator="none"
      onRowDragEnter={(p) => {
        if (p.over.kind === "viewport") return;
        setOverId(p.over.row.id);
        setIsBefore(p.over.rowIndex < p.source.rowIndex);
      }}
      onRowDragLeave={(p) => {
        if (p.over.kind === "viewport") return;
        setOverId(null);
      }}
      onRowDrop={(p) => {
        setOverId(null);

        if (p.over.kind === "viewport") return;
        const sourceRow = p.source.row;
        const rows = sourceRow.kind === "branch" ? p.source.api.rowLeafs(sourceRow.id) : [sourceRow.id];

        const overRow = p.over.row;
        const overId = p.over.row.kind === "branch" ? p.over.api.rowLeafs(overRow.id)[0] : overRow.id;

        if (rows.includes(overId)) return;

        const moveItems = rows.map((r) => items.findIndex((x) => x.id === r)).sort((l, r) => l - r);
        const target = items.findIndex((x) => x.id === overId);

        const next = moveRelative(items, moveItems[0], target, moveItems.slice(1));

        onItemsReordered?.(next);
      }}
      events={useMemo<GridEvents<Spec>>(() => {
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
    </Root>
  );
}

export const TreeView = forwardRef(TreeViewBase) as <T extends TreeViewItem>(
  props: TreeViewProps<T>,
) => ReactNode;
