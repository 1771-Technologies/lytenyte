import "./grid-navigation.css";
import type { Meta, StoryObj } from "@storybook/react";
import { useLyteNyte } from "../state/use-lytenyte";
import { useId } from "react";
import type { Column } from "../+types";
import { useClientRowDataSource } from "../row-data-source-client/use-client-data-source";
import { bankData } from "./sample-data/bank-data";
import { ColumnManager as CM } from "../column-manager/column-manager.js";
import type { TreeVirtualItem } from "../tree-view/virtualized/make-virtual-tree";
import { Root } from "../root/root";
import { Viewport } from "../viewport/viewport";
import { Header } from "../header/header";
import { HeaderRow } from "../header/header-row";
import { HeaderGroupCell } from "../header/header-group-cell";
import { HeaderCell } from "../header/header-cell";
import { RowsContainer } from "../rows/rows-container";
import { RowsBottom, RowsCenter, RowsTop } from "../rows/rows-sections";
import { RowHandler } from "./sample-data/row-handler";

const meta: Meta = {
  title: "Grid/Column Manager",
};

export default meta;

const columns: Column<any>[] = [
  { id: "age" },
  { id: "job" },
  { id: "balance", pin: "start" },
  { id: "education", pin: "end" },
  { id: "marital", groupPath: ["A", "B"] },
  { id: "default", groupPath: ["A"] },
  { id: "housing" },
  { id: "loan" },
  { id: "contact" },
  { id: "day" },
  { id: "month" },
  { id: "duration" },
  { id: "campaign" },
  { id: "pdays", groupPath: ["A", "C"] },
  { id: "previous" },
  { id: "poutcome" },
  { id: "y" },
];

function Component({ data = bankData }: { data?: any[] }) {
  const ds = useClientRowDataSource({
    data: data,
    topData: data.slice(0, 2),
    bottomData: data.slice(0, 2),
  });

  const g = useLyteNyte({
    gridId: useId(),
    columns,
    rowDataSource: ds,

    cellSelectionMode: "range",

    columnBase: {
      uiHints: {
        movable: true,
        resizable: true,
      },
    },
  });

  const { rootProps, spacer, tree } = CM.useColumnManager(g);

  const view = g.view.useValue();

  return (
    <div>
      <div>
        <button onClick={() => g.state.rtl.set((prev) => !prev)}>
          RTL: {g.state.rtl.get() ? "Yes" : "No"}
        </button>
      </div>

      <div style={{ display: "flex" }}>
        <div style={{ width: "30%", height: "90vh", border: "1px solid black" }}>
          <CM.Root {...rootProps}>
            <CM.Panel>
              <CM.PassiveScroll>
                {tree.map((c) => {
                  return (
                    <RenderNode item={c} key={c.kind === "branch" ? c.branch.id : c.leaf.data.id} />
                  );
                })}
              </CM.PassiveScroll>
              {spacer}
            </CM.Panel>
          </CM.Root>
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

function RenderNode<T>({ item }: { item: TreeVirtualItem<Column<T>> }) {
  if (item.kind === "leaf") {
    return (
      <CM.Leaf item={item} style={{ display: "flex", gap: "2px" }}>
        <CM.MoveHandle>O</CM.MoveHandle>
        <CM.VisibilityCheckbox />
        <CM.Label />
      </CM.Leaf>
    );
  }

  const values = [...item.children.values()];

  return (
    <CM.Branch
      item={item}
      label={
        <div style={{ display: "flex", gap: "2px" }}>
          <CM.MoveHandle>O</CM.MoveHandle>
          <CM.VisibilityCheckbox />
          <CM.Label />
        </div>
      }
    >
      {values.map((c) => {
        return <RenderNode item={c} key={c.kind === "branch" ? c.branch.id : c.leaf.data.id} />;
      })}
    </CM.Branch>
  );
}

export const ColumnManagerComp: StoryObj = {
  render: Component,
};
