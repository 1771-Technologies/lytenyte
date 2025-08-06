import "./grid-navigation.css";
import "./grid-item-box.css";
import type { Meta, StoryObj } from "@storybook/react";
import { GridBox as GB } from "../grid-box/grid-box.js";
import { useLyteNyte } from "../state/use-lytenyte";
import { useId } from "react";
import type { Column } from "../+types";
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

const meta: Meta = {
  title: "Grid/Grid Item Box",
};

export default meta;

const columns: Column<any>[] = [{ id: "job" }, { id: "education" }, { id: "marital" }];

function Component({ data = bankData }: { data?: any[] }) {
  const ds = useClientRowDataSource({
    data: data,
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

  const box = GB.useColumnBoxItems({
    grid: g,
    onDrop: ({ isBefore, src, target }) => {
      if (src.id === target.id) return;
      g.api.columnMove({ moveColumns: [src], moveTarget: target, before: isBefore });
    },
    onAction: (c) => {
      console.log(c);
    },
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
              <GB.Panel className="grid-box">
                {box.items.map((c) => {
                  return (
                    <GB.Item style={{ height: 40 }} item={c} key={c.id}>
                      {c.label}
                    </GB.Item>
                  );
                })}
              </GB.Panel>
            </GB.Root>
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

export const GridItemBox: StoryObj = {
  render: Component,
};
