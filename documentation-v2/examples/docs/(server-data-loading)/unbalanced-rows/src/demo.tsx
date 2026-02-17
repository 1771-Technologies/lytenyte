"use client";

import "@1771technologies/lytenyte-pro/light-dark.css";
import { useMemo, useState } from "react";
import { Server } from "./server.js";
import { LastModified, SizeRenderer } from "./components.js";
import { Grid, useServerDataSource } from "@1771technologies/lytenyte-pro";
import { RowGroupCell } from "@1771technologies/lytenyte-pro/components";

const columns: Grid.Column<{ data: any }>[] = [
  {
    id: "name",
    name: "Name",
    width: 200,
    widthFlex: 1,
    cellRenderer: (p) => {
      return (
        <RowGroupCell
          {...p}
          leafLabel={(p) => {
            if (p.loading) return null;
            return (
              <div className="font-bold" style={{ paddingInlineStart: 18 }}>
                {p.data.name}
              </div>
            );
          }}
        />
      );
    },
  },
  { id: "size", name: "Size", cellRenderer: SizeRenderer },
  { id: "last_modified", name: "Modified", cellRenderer: LastModified },
  { id: "type", width: 100, name: "Ext" },
];

export default function ServerDataDemo() {
  const [expansions, setExpansions] = useState<Record<string, boolean | undefined>>({ Documents: true });
  const ds = useServerDataSource<any>({
    queryFn: (params) => {
      return Server(params.requests);
    },
    queryKey: [],
    rowGroupExpansions: expansions,
    onRowGroupExpansionChange: setExpansions,
    blockSize: 50,
  });

  const isLoading = ds.isLoading.useValue();

  return (
    <div className="ln-grid" style={{ height: 500 }}>
      <Grid
        rowSource={ds}
        columns={columns}
        rowGroupColumn={false}
        styles={useMemo(() => {
          return { viewport: { style: { scrollbarGutter: "stable" } } };
        }, [])}
        slotViewportOverlay={
          isLoading && (
            <div className="bg-ln-gray-20/40 absolute left-0 top-0 z-20 h-full w-full animate-pulse"></div>
          )
        }
      />
    </div>
  );
}
