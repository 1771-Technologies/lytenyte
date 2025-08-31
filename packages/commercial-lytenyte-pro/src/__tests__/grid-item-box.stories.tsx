// import "./grid-navigation.css";
import "./grid-item-box.css";
import type { Meta, StoryObj } from "@storybook/react";
import { GridBox as GB } from "../grid-box/grid-box.js";
import { useLyteNyte } from "../state/use-lytenyte";
import { useId } from "react";
import type { Column } from "../+types";
import { useClientRowDataSource } from "../row-data-source-client/use-client-data-source";
import { bankData } from "./sample-data/bank-data";

const meta: Meta = {
  title: "Grid/Grid Item Box",
};

export default meta;

const columns: Column<any>[] = [
  { id: "job" },
  { id: "education" },
  { id: "balance" },
  { id: "marital" },
  { id: "default" },
  { id: "housing" },
  { id: "loan" },
];

function Component({ data = bankData }: { data?: any[] }) {
  const ds = useClientRowDataSource({
    data: data,
  });

  const g = useLyteNyte({
    gridId: useId(),
    columns,
    rowDataSource: ds,
    filterInModel: {
      education: { kind: "in", operator: "in", value: new Set(["primary"]) },
    },

    rowGroupModel: ["marital", { field: "education", name: "All in", kind: "field", id: "xx" }],
    aggModel: {
      balance: { fn: "sum" },
    },

    columnBase: {
      uiHints: {
        aggDefault: "first",
        movable: true,
        resizable: true,
        sortable: true,
        rowGroupable: true,
      },
    },
  });

  const box = GB.useColumnBoxItems({
    grid: g,
    onDrop: ({ isBefore, src, target }) => {
      if (src.id === target.id) return;
      g.api.columnMove({ moveColumns: [src], moveTarget: target, before: isBefore });
    },
    onAction: (c) => {
      console.log(c);
    },
    onDelete: (c) => {
      console.log("delete", c);
    },
  });
  const groupBox = GB.useRowGroupBoxItems({
    grid: g,
    includeGroupables: true,
  });
  const aggBox = GB.useAggregationBoxItems({
    grid: g,
  });

  return (
    <div>
      <div>
        <button onClick={() => g.state.rtl.set((prev) => !prev)}>
          RTL: {g.state.rtl.get() ? "Yes" : "No"}
        </button>
      </div>

      <div style={{ display: "flex" }}>
        <div style={{ width: "50%", height: "90vh", border: "1px solid black", display: "flex" }}>
          <div style={{ flex: 1 }}>
            <GB.Root {...box.rootProps}>
              <GB.Panel
                className="grid-box"
                style={{
                  height: "200px",
                  border: "1px solid black",
                }}
              >
                {box.items.map((c) => {
                  return (
                    <GB.Item
                      style={{ display: "flex", flexDirection: "column", height: 24 }}
                      item={c}
                      key={c.id}
                    >
                      {c.label}
                    </GB.Item>
                  );
                })}
              </GB.Panel>
            </GB.Root>
          </div>

          <div style={{ flex: 1 }}>
            <GB.Root {...groupBox.rootProps}>
              <GB.Panel
                className="grid-box"
                style={{
                  height: "200px",
                  border: "1px solid black",
                }}
              >
                {groupBox.items.map((c) => {
                  return (
                    <GB.Item
                      style={{ display: "flex", flexDirection: "column", height: 24 }}
                      item={c}
                      key={c.id}
                    >
                      {c.label}
                    </GB.Item>
                  );
                })}
              </GB.Panel>
            </GB.Root>
          </div>

          <div style={{ flex: 1 }}>
            <GB.Root {...aggBox.rootProps}>
              <GB.Panel
                className="grid-box"
                style={{
                  height: "200px",
                  border: "1px solid black",
                }}
              >
                {aggBox.items.map((c) => {
                  return (
                    <GB.Item
                      style={{ display: "flex", flexDirection: "column", height: 24 }}
                      item={c}
                      key={c.id}
                    >
                      {c.label}
                    </GB.Item>
                  );
                })}
              </GB.Panel>
            </GB.Root>
          </div>
        </div>
      </div>
    </div>
  );
}

export const GridItemBox: StoryObj = {
  render: Component,
};
