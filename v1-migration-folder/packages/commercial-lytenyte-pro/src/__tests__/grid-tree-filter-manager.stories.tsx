import "./grid-navigation.css";
import type { Meta, StoryObj } from "@storybook/react";
import { useLyteNyte } from "../state/use-lytenyte";
import { useId } from "react";
import type { Column, FilterInFilterItem } from "../+types";
import { useClientRowDataSource } from "../row-data-source-client/use-client-data-source";
import { bankData } from "./sample-data/bank-data";
import { Root } from "../root/root";
import { Viewport } from "../viewport/viewport";
import { Header } from "../header/header";
import { HeaderRow } from "../header/header-row";
import { HeaderGroupCell } from "../header/header-group-cell";
import { HeaderCell } from "../header/header-cell";
import { RowsContainer } from "../rows/rows-container";
import { RowsBottom, RowsCenter, RowsTop } from "../rows/rows-sections";
import { RowHandler } from "./sample-data/row-handler";
import { FilterTree as FM } from "../filter-tree/filter-tree";
import type { TreeVirtualItem } from "../tree-view/virtualized/make-virtual-tree";
import { InclusionCheckbox } from "../filter-tree/inclusion-checkbox";

const meta: Meta = {
  title: "Grid/Tree Filter",
};

export default meta;

const columns: Column<any>[] = [
  { id: "age", type: "number" },
  { id: "job" },
  { id: "balance", type: "number" },
  { id: "education" },
  { id: "marital" },
  { id: "default" },
  { id: "housing" },
  { id: "loan" },
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

function Component({ data = bankData }: { data?: any[] }) {
  const ds = useClientRowDataSource({
    data: data,
    topData: data.slice(0, 2),
    bottomData: data.slice(0, 2),

    transformInFilterItem: ({ field }) => {
      if (field === "unknown")
        return { label: `${field}`, id: `${field}`, value: field, groupPath: ["Alpha"] };

      return { label: `${field}`, id: `${field}`, value: field };
    },
  });

  const g = useLyteNyte({
    gridId: useId(),
    columns,
    rowDataSource: ds,

    cellSelectionMode: "range",

    sortModel: [
      { columnId: "age", sort: { kind: "number" } },
      { columnId: "balance", sort: { kind: "custom", comparator: () => 1, columnId: "balance" } },
    ],

    columnBase: {
      uiHints: {
        movable: true,
        resizable: true,
        sortable: true,
      },
    },
  });

  const view = g.view.useValue();

  const filterProps = FM.useFilterTree({
    column: columns[1],
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
        <div style={{ width: "30%", height: "90vh", border: "1px solid black" }}>
          <FM.Root {...filterProps.rootProps}>
            <FM.Panel>
              <FM.PassiveScroll>
                {filterProps.tree.map((c) => {
                  return (
                    <RenderNode item={c} key={c.kind === "branch" ? c.branch.id : c.leaf.data.id} />
                  );
                })}
              </FM.PassiveScroll>
              {filterProps.spacer}
            </FM.Panel>
          </FM.Root>
        </div>
        <div style={{ width: "70%", height: "90vh", border: "1px solid black" }}>
          <Root grid={g}>
            <Viewport>
              <Header>
                {view.header.layout.map((row, i) => {
                  return (
                    <HeaderRow headerRowIndex={i} key={i}>
                      {row.map((c) => {
                        if (c.kind === "group") {
                          return (
                            <HeaderGroupCell
                              cell={c}
                              key={c.idOccurrence}
                              style={{ border: "1px solid black", background: "lightgray" }}
                            />
                          );
                        }
                        return (
                          <HeaderCell
                            cell={c}
                            key={c.column.id}
                            style={{ border: "1px solid black", background: "lightgray" }}
                          />
                        );
                      })}
                    </HeaderRow>
                  );
                })}
              </Header>

              <RowsContainer>
                <RowsTop>
                  <RowHandler rows={view.rows.top} />
                </RowsTop>
                <RowsCenter>
                  <RowHandler rows={view.rows.center} />
                </RowsCenter>
                <RowsBottom>
                  <RowHandler rows={view.rows.bottom} />
                </RowsBottom>
              </RowsContainer>
            </Viewport>
          </Root>
        </div>
      </div>
    </div>
  );
}

function RenderNode({ item }: { item: TreeVirtualItem<FilterInFilterItem> }) {
  if (item.kind === "leaf") {
    return (
      <FM.Leaf item={item} style={{ display: "flex", gap: "2px" }}>
        <InclusionCheckbox />
        <FM.Label />
      </FM.Leaf>
    );
  }

  const values = [...item.children.values()];

  return (
    <FM.Branch
      item={item}
      label={
        <div style={{ display: "flex", gap: "2px" }}>
          <InclusionCheckbox />
          <FM.Label />
        </div>
      }
    >
      {values.map((c) => {
        return <RenderNode item={c} key={c.kind === "branch" ? c.branch.id : c.leaf.data.id} />;
      })}
    </FM.Branch>
  );
}

export const TreeFilter: StoryObj = {
  render: Component,
};
