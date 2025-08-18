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
  { id: "age" },
  { id: "job" },
  { id: "education" },
  { id: "marital" },
];

function Component({ data = bankData }: { data?: any[] }) {
  const ds = useClientRowDataSource({
    data: data,
    transformInFilterItem: (params) => {
      if (params.column.id === "age") {
        return params.values.map((c) => {
          const v = c as number;
          let group;

          if (v < 20) group = "0 < 20";
          else if (v < 40) group = "20 < 40";
          else if (v < 60) group = "40 < 60";
          else group = "60+";

          return {
            id: `${v}`,
            label: `${v} years`,
            value: v,
            groupPath: [group],
          };
        });
      }

      return params.values.map((c) => ({
        id: `${c}`,
        label: `${c}`,
        value: c,
      }));
    },
  });

  const g = useLyteNyte({
    gridId: useId(),
    columns,
    rowDataSource: ds,
    filterInModel: {
      education: { kind: "in", operator: "in", value: new Set(["primary"]) },
    },

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
    column: columns[0],
    grid: g,
  });
  const filterProps2 = FM.useFilterTree({
    column: columns[1],
    grid: g,
    applyChangesImmediately: true,
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
            <FM.Root {...filterProps.rootProps}>
              <FM.Panel style={{ height: 300, width: 300, overflow: "auto", position: "relative" }}>
                {filterProps.tree.map((c) => {
                  return (
                    <RenderNode item={c} key={c.kind === "branch" ? c.branch.id : c.leaf.data.id} />
                  );
                })}
                {filterProps.spacer}
              </FM.Panel>

              <button onClick={filterProps.apply}>Apply</button>
              <button onClick={filterProps.reset}>Reset</button>
            </FM.Root>
          </div>
          <div style={{ flex: 1 }}>
            <FM.Root {...filterProps2.rootProps}>
              <FM.Panel>
                <FM.PassiveScroll>
                  {filterProps2.tree.map((c) => {
                    return (
                      <RenderNode
                        item={c}
                        key={c.kind === "branch" ? c.branch.id : c.leaf.data.id}
                      />
                    );
                  })}
                </FM.PassiveScroll>
                {filterProps2.spacer}
              </FM.Panel>
            </FM.Root>
          </div>
        </div>
        <div style={{ width: "50%", height: "90vh", border: "1px solid black" }}>
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
      labelWrap={<div style={{ display: "flex", alignItems: "center", gap: "2px" }} />}
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
