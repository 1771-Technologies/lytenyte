"use client";

import "@1771technologies/lytenyte-pro-experimental/light-dark.css";
import { useId, useMemo } from "react";
import { handleUpdate, Server } from "./server.jsx";
import { type SalaryData } from "./data.js";
import {
  AgeCellRenderer,
  BaseCellRenderer,
  NumberEditor,
  NumberEditorInteger,
  SalaryRenderer,
  TextEditor,
  YearsOfExperienceRenderer,
} from "./components.jsx";
import { Grid, useServerDataSource } from "@1771technologies/lytenyte-pro-experimental";

export interface GridSpec {
  readonly data: SalaryData;
}

const columns: Grid.Column<GridSpec>[] = [
  {
    id: "Gender",
    width: 120,
    widthFlex: 1,
    cellRenderer: BaseCellRenderer,
    editRenderer: TextEditor,
    editable: true,
  },
  {
    id: "Education Level",
    name: "Education",
    width: 160,
    widthFlex: 1,
    cellRenderer: BaseCellRenderer,
    editRenderer: TextEditor,
    editable: true,
  },
  {
    id: "Age",
    type: "number",
    width: 100,
    widthFlex: 1,
    cellRenderer: AgeCellRenderer,
    editRenderer: NumberEditorInteger,
    editable: true,
  },
  {
    id: "Years of Experience",
    name: "YoE",
    type: "number",
    width: 100,
    widthFlex: 1,
    cellRenderer: YearsOfExperienceRenderer,
    editRenderer: NumberEditorInteger,
    editable: true,
  },
  {
    id: "Salary",
    type: "number",
    width: 160,
    widthFlex: 1,
    cellRenderer: SalaryRenderer,
    editRenderer: NumberEditor,
    editable: true,
  },
];

export default function BasicServerData() {
  const resetKey = useId();

  const ds = useServerDataSource<SalaryData>({
    queryFn: (params) => {
      return Server(params.requests, resetKey);
    },
    queryKey: [],
    rowUpdateOptimistically: true,
    onRowDataChange: async ({ rows }) => {
      const updates = new Map([...rows.entries()].map(([key, row]) => [key.id, row]));

      await handleUpdate(updates, resetKey);
      ds.refresh();
    },
    blockSize: 50,
  });

  const isLoading = ds.isLoading.useValue();

  return (
    <div className="ln-grid" style={{ height: 500 }}>
      <Grid
        rowSource={ds}
        editMode="cell"
        editClickActivator="single-click"
        columns={columns}
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
