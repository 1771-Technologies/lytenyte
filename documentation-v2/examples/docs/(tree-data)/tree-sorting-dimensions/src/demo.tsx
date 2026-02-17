import "@1771technologies/lytenyte-pro/light-dark.css";
import { computeField, Grid, useTreeDataSource } from "@1771technologies/lytenyte-pro";
import { data } from "./tree.js";
import { AvatarCell, GroupCell, Header, ModifiedCell, SizeCell } from "./components.jsx";
import { useMemo, useState } from "react";

export interface GridSpec {
  readonly data: {
    kind: string;
    name: string;
    size: number;
    modified: string;
    lastEditedBy: string;
    permissions: string;
  };
  readonly column: { sort?: "asc" | "desc"; sortIndex?: number };
  readonly api: {
    sortColumn: (id: string, dir: "asc" | "desc" | null, additive?: boolean) => void;
  };
}

const initialColumns: Grid.Column<GridSpec>[] = [
  { id: "name", name: "Group", cellRenderer: GroupCell, width: 240, pin: "start" },
  { id: "size", type: "number", name: "Size", cellRenderer: SizeCell },
  { id: "modified", name: "Modified", cellRenderer: ModifiedCell, width: 130 },
  { id: "lastEditedBy", name: "Last Edited By", cellRenderer: AvatarCell },
  { id: "permissions", name: "Permissions" },
];

const base: Grid.ColumnBase<GridSpec> = { widthFlex: 1, width: 120, headerRenderer: Header };

export default function TreeDataDemo() {
  const [columns, setColumns] = useState(initialColumns);

  const sortDimension = useMemo(() => {
    const sorts = columns.filter((x) => x.sort).sort((l, r) => (l.sortIndex ?? 0) - (r.sortIndex ?? 0));

    return sorts.map((columnWithSort) => {
      return {
        dim: {
          ...columnWithSort,
          field: (p) => {
            const value = computeField(columnWithSort.id ?? columnWithSort.field, p.row);
            if (typeof value === "string") return value.toLowerCase();
            return value;
          },
        },
        descending: columnWithSort.sort === "desc",
      } satisfies Grid.T.DimensionSort<GridSpec["data"]>;
    });
  }, [columns]);

  const apiExtension = useMemo<GridSpec["api"]>(() => {
    return {
      sortColumn: (id, dir, additive) => {
        setColumns((prev) => {
          const nextIndex = Math.max(0, ...prev.map((x) => x.sortIndex ?? 0));

          const updated = prev.map((x) => {
            let next = x;
            // Remove any existing sort when we are performing a non-additive sort.
            if (x.sort && x.id !== id && !additive) {
              next = { ...x };
              delete next.sort;
              delete next.sortIndex;
            } else if (x.id === id) {
              next = { ...x };
              if (dir == null) {
                delete next.sort;
                delete next.sortIndex;
              } else {
                // We are adding a new sort
                next.sort = dir;
                if (additive && next.sortIndex == null) {
                  next.sortIndex = nextIndex + 1;
                }
              }
            }

            return next;
          });

          // Ensures the sort index consistency
          const sortIndexEntries = updated
            .filter((x) => x.sort)
            .toSorted((l, r) => (l.sortIndex ?? 0) - (r.sortIndex ?? 0))
            .map((c, i) => [c.id, i + 1]);
          const newSortIndices = Object.fromEntries(sortIndexEntries);

          return updated.map((col) => {
            if (newSortIndices[col.id])
              return {
                ...col,
                // If we have only one sort there is no need for a sort index number.
                sortIndex: sortIndexEntries.length === 1 ? undefined : newSortIndices[col.id],
              };
            return col;
          });
        });
      },
    };
  }, []);

  const ds = useTreeDataSource({
    data: data,
    rowGroupDefaultExpansion: true,
    sort: sortDimension,

    rowChildrenFn: (x: any) => {
      if (!x.children) return [];
      return x.children.map((r: any) => [r.name, r]);
    },
    rowValueFn: (x) => ({
      name: x.name,
      kind: x.kind,
      size: x.size || null,
      modified: x.modified,
      lastEditedBy: x.lastEditedBy,
      permissions: x.permissions,
    }),
  });

  return (
    <>
      <div className="ln-grid" style={{ height: 500 }}>
        <Grid
          apiExtension={apiExtension}
          rowSource={ds}
          rowGroupColumn={false}
          columnBase={base}
          columns={columns}
          events={{
            headerCell: {
              keyDown: ({ column, event: ev }) => {
                if (ev.key === "Enter") {
                  const nextSort = column.sort === "asc" ? null : column.sort === "desc" ? "asc" : "desc";
                  apiExtension.sortColumn(column.id, nextSort, ev.metaKey || ev.ctrlKey);
                }
              },
            },
          }}
        />
      </div>
    </>
  );
}
