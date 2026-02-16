"use client";
import "@1771technologies/lytenyte-pro-experimental/pill-manager.css";
import "@1771technologies/lytenyte-pro-experimental/light-dark.css";
import {
  Grid,
  Menu,
  PillManager,
  RowGroupCell,
  useServerDataSource,
} from "@1771technologies/lytenyte-pro-experimental";

import { useMemo, useState } from "react";
import { Server } from "./server.js";
import type { SalaryData } from "./data";
import {
  AgeCellRenderer,
  BaseCellRenderer,
  SalaryRenderer,
  tw,
  YearsOfExperienceRenderer,
} from "./components.js";
import { CheckIcon } from "@radix-ui/react-icons";

export interface GridSpec {
  readonly data: SalaryData;
  readonly column: { agg: string; allowedAggs: string[] };
}

const initialColumns: Grid.Column<GridSpec>[] = [
  {
    id: "Gender",
    width: 120,
    widthFlex: 1,
    cellRenderer: BaseCellRenderer,
    agg: "first",
    allowedAggs: ["first", "last"],
    headerRenderer: HeaderCell,
  },
  {
    id: "Education Level",
    name: "Education",
    width: 160,
    hide: true,
    widthFlex: 1,
    cellRenderer: BaseCellRenderer,
    agg: "first",
    allowedAggs: ["first", "last"],
    headerRenderer: HeaderCell,
  },
  {
    id: "Age",
    type: "number",
    width: 100,
    widthFlex: 1,
    cellRenderer: AgeCellRenderer,
    agg: "avg",
    allowedAggs: ["avg", "first", "last"],
    headerRenderer: HeaderCell,
  },
  {
    id: "Years of Experience",
    name: "YoE",
    type: "number",
    width: 100,
    widthFlex: 1,
    cellRenderer: YearsOfExperienceRenderer,
    agg: "max",
    allowedAggs: ["avg", "sum", "max", "min"],
    headerRenderer: HeaderCell,
  },
  {
    id: "Salary",
    type: "number",
    width: 160,
    widthFlex: 1,
    cellRenderer: SalaryRenderer,
    agg: "avg",
    allowedAggs: ["avg", "sum", "max", "min"],
    headerRenderer: HeaderCell,
  },
];

const group: Grid.RowGroupColumn<GridSpec> = {
  cellRenderer: RowGroupCell,
  width: 200,
  pin: "start",
};

export default function ServerDataDemo() {
  const [columns, setColumns] = useState(initialColumns);
  const [rowGroups, setRowGroups] = useState<PillManager.T.PillItem[]>([
    { name: "Education Level", id: "Education Level", active: true, movable: true },
    { name: "Gender", id: "Gender", active: false, movable: true },
    { name: "Age", id: "Age", active: false, movable: true },
    { name: "YoE", id: "Years of Experience", active: false, movable: true },
  ]);

  const model = useMemo(() => rowGroups.filter((x) => x.active).map((x) => x.id), [rowGroups]);

  const aggModel = useMemo(() => {
    return Object.fromEntries(columns.map((x) => [x.id, { fn: x.agg }]));
  }, [columns]);

  const ds = useServerDataSource({
    queryFn: (params) => {
      return Server(params.requests, params.queryKey[0], params.queryKey[1]);
    },

    hasRowBranches: model.length > 0,
    queryKey: [model, aggModel] as const,
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
          onColumnsChange={setColumns}
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

//#start
export function HeaderCell({ api, column }: Grid.T.HeaderParams<GridSpec>) {
  return (
    <div
      className={tw(
        "flex items-center justify-between gap-2",
        column.type === "number" && "flex-row-reverse",
      )}
    >
      <div>{column.name ?? column.id}</div>
      {column.agg && (
        <Menu>
          <Menu.Trigger className="text-ln-primary-50 hover:bg-ln-bg-strong cursor-pointer rounded px-1 py-1 text-[10px] transition-colors">
            ({column.agg})
          </Menu.Trigger>
          <Menu.Popover>
            <Menu.Arrow />
            <Menu.Container>
              <Menu.RadioGroup
                value={column.agg}
                onChange={(x) => {
                  api.columnUpdate({ [column.id]: { agg: x } });
                }}
              >
                {column.allowedAggs.map((x) => {
                  return (
                    <Menu.RadioItem key={x} value={x} className="flex items-center justify-between gap-1">
                      {x}
                      {column.agg === x && <CheckIcon className="text-ln-primary-50" />}
                    </Menu.RadioItem>
                  );
                })}
              </Menu.RadioGroup>
            </Menu.Container>
          </Menu.Popover>
        </Menu>
      )}
    </div>
  );
}
