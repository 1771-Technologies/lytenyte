import { useMemo, useState } from "react";
import { ListView, type ListViewItemRendererProps } from "../src/list-view";
import type { PathTreeInputItem } from "@1771technologies/path-tree";

export const bankColumns = [
  {
    id: "age",
    type: "number",
    floatingCellRenderer: "date",
    groupPath: ["Information"],
    aggFn: "sum",
    columnMenuTrigger: "icon-on-hover",
    headerTooltip: {
      component: () => <div>Bobo 123</div>,
      placement: "bottom",
    },
  },
  {
    id: "job",
    cellEditPredicate: true,
    groupPath: ["Information"],
    headerTooltip: "forever 1",
    secondaryLabel: "alpha",
    aggFn: "count",
    headerAggFnDisplayMode: "secondary",
  },
  { id: "balance", headerJustify: "end", type: "number", measureFn: "sum" },
  { id: "education", groupPath: ["Information"], headerJustify: "start" },
  { id: "marital", groupPath: ["Information"], headerJustify: "center" },
  { id: "default" },
  { id: "housing", pin: "start", secondaryLabel: "alpha", aggFn: "first" },
  { id: "loan", pin: "end" },
  { id: "contact" },
  { id: "day" },
  { id: "month" },
  { id: "duration" },
  { id: "campaign" },
  { id: "pdays" },
  { id: "previous" },
  { id: "poutcome" },
  { id: "y" },
];

export default function Home() {
  const paths = useMemo(() => {
    return bankColumns
      .concat(bankColumns)
      .concat(bankColumns)
      .concat(bankColumns)
      .map<PathTreeInputItem<any>>((c) => {
        return { path: c.groupPath ?? [], data: c };
      });
  }, []);
  const [expansions, setExpansions] = useState<Record<string, boolean>>({});

  return (
    <div
      className={css`
        display: flex;
        justify-content: center;
        padding-top: 4rem;
        box-sizing: border-box;
        width: 100vw;
        height: 100vh;
      `}
    >
      <div style={{ width: 400, height: 600 }}>
        <ListView
          className={css`
            border: 1px solid black;
            border-radius: 4px;
          `}
          paths={paths}
          renderer={Renderer}
          expansions={expansions}
          onExpansionChange={(id, s) => setExpansions((prev) => ({ ...prev, [id]: s }))}
          onAction={(p) => alert(JSON.stringify(p.path))}
          axe={{
            axeDescription: "T",
            axeItemLabels: (item) => {
              return item.type === "parent" ? item.path.at(-1)! : item.data.id;
            },
            axeLabel: (cnt) => `Item list with ${cnt} items`,
          }}
        />
      </div>
    </div>
  );
}

function Renderer(p: ListViewItemRendererProps<any>) {
  const header = p.data.type === "parent" ? p.data.path.at(-1)! : p.data.data.id;
  return (
    <div
      className={css`
        height: 100%;
        width: 100%;
        display: flex;
        align-items: center;
        box-sizing: border-box;
        &:hover {
          background-color: rgb(0, 0, 0, 0.2);
        }
      `}
      style={{
        paddingInlineStart: p.depth * 24 + 16,
      }}
    >
      {header}
    </div>
  );
}
