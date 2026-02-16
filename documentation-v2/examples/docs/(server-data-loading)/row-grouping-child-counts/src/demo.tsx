"use client";
import "@1771technologies/lytenyte-pro-experimental/pill-manager.css";
import "@1771technologies/lytenyte-pro-experimental/light-dark.css";
import {
  Grid,
  PillManager,
  RowGroupCell,
  useServerDataSource,
} from "@1771technologies/lytenyte-pro-experimental";

import { useMemo, useState } from "react";
import { Server } from "./server.jsx";
import type { SalaryData } from "./data.js";
import {
  AgeCellRenderer,
  BaseCellRenderer,
  SalaryRenderer,
  YearsOfExperienceRenderer,
} from "./components.jsx";

export interface GridSpec {
  readonly data: SalaryData;
}

const columns: Grid.Column<GridSpec>[] = [
  {
    id: "Gender",
    width: 120,
    widthFlex: 1,
    cellRenderer: BaseCellRenderer,
  },
  {
    id: "Education Level",
    name: "Education",
    width: 160,
    hide: true,
    widthFlex: 1,
    cellRenderer: BaseCellRenderer,
  },
  {
    id: "Age",
    type: "number",
    width: 100,
    widthFlex: 1,
    cellRenderer: AgeCellRenderer,
  },
  {
    id: "Years of Experience",
    name: "YoE",
    type: "number",
    width: 100,
    widthFlex: 1,
    cellRenderer: YearsOfExperienceRenderer,
  },
  { id: "Salary", type: "number", width: 160, widthFlex: 1, cellRenderer: SalaryRenderer },
];

const group: Grid.RowGroupColumn<GridSpec> = {
  cellRenderer: (p) => {
    return (
      <RowGroupCell
        {...p}
        groupLabel={(row) => (
          <div className="flex items-baseline gap-1">
            <div>{row.key || "(blank)"}</div>
            <div className="text-ln-text-xlight text-xs">({row.data.childCnt as number})</div>
          </div>
        )}
      />
    );
  },
  width: 200,
  pin: "start",
};

export default function ServerDataDemo() {
  const [rowGroups, setRowGroups] = useState<PillManager.T.PillItem[]>([
    { name: "Education Level", id: "Education Level", active: true, movable: true },
    { name: "Gender", id: "Gender", active: false, movable: true },
    { name: "Age", id: "Age", active: false, movable: true },
    { name: "YoE", id: "Years of Experience", active: false, movable: true },
  ]);

  const model = useMemo(() => rowGroups.filter((x) => x.active).map((x) => x.id), [rowGroups]);

  const ds = useServerDataSource({
    queryFn: (params) => {
      return Server(params.requests, params.queryKey[0]);
    },
    hasRowBranches: model.length > 0,
    queryKey: [model] as const,
    blockSize: 50,
  });

  const isLoading = ds.isLoading.useValue();

  return (
    <>
      <PillManager
        onPillItemActiveChange={(p) => {
          setRowGroups((prev) => {
            return [...prev].map((x) => {
              if (p.item.id === x.id) {
                return { ...x, active: p.item.active };
              }
              return x;
            });
          });
        }}
        onPillRowChange={(ev) => {
          setRowGroups(ev.changed[0].pills);
        }}
        rows={[
          {
            id: "row-groups",
            label: "Row Groups",
            type: "row-groups",
            pills: rowGroups,
          },
        ]}
      />
      <div className="ln-grid" style={{ height: 500 }}>
        <Grid
          rowSource={ds}
          columns={columns}
          rowGroupColumn={group}
          slotViewportOverlay={
            isLoading && (
              <div className="bg-ln-gray-20/40 absolute left-0 top-0 z-20 h-full w-full animate-pulse"></div>
            )
          }
        />
      </div>
    </>
  );
}
