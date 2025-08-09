import "../../main.css";
import "./grid-navigation.css";
import type { Meta, StoryObj } from "@storybook/react";
import { Header } from "../header/header";
import { HeaderRow } from "../header/header-row";
import { Root } from "../root/root";
import { RowsContainer } from "../rows/rows-container";
import { Viewport } from "../viewport/viewport";
import { useLyteNyte } from "../state/use-lytenyte";
import { useId, useState } from "react";
import { HeaderCell } from "../header/header-cell";
import type { Column } from "../+types";
import { HeaderGroupCell } from "../header/header-group-cell";
import { RowsBottom, RowsCenter, RowsTop } from "../rows/rows-sections";
import { RowHandler } from "./sample-data/row-handler";
import { useClientRowDataSource } from "../row-data-source-client/use-client-data-source";

const meta: Meta = {
  title: "Grid/Data Updating",
};

export default meta;

const columns: Column<any>[] = [{ id: "x" }, { id: "y" }, { id: "v" }];

function Component() {
  const [d, setD] = useState([
    { v: "A", x: 1, y: 2 },
    { v: "A", x: 2, y: 3 },
  ]);
  const ds = useClientRowDataSource({
    rowIdLeaf: (_, i) => `${i}`,
    data: d,
    reflectData: true,
  });
  const g = useLyteNyte({
    gridId: useId(),
    columns,
    rowDataSource: ds,
    rowSelectionMode: "multiple",
    rowSelectionActivator: "single-click",
    aggModel: {
      x: { fn: "sum" },
      y: { fn: "sum" },
    },
    rowGroupModel: ["v"],
  });

  const view = g.view.useValue();

  return (
    <div>
      <div>
        <button
          onClick={() => {
            setD((prev) => {
              return prev.map((c) => {
                return { v: "A", x: c.x + 1, y: c.y + 1 };
              });
            });
          }}
        >
          Update Reflective
        </button>
        <button
          onClick={() => {
            ds.rowUpdate(
              new Map(d.map((_, i) => [`${i}`, { v: "A", x: Math.random(), y: Math.random() }])),
            );
          }}
        >
          Update Data
        </button>
      </div>

      <div
        className="lng-grid"
        style={{ width: "100%", height: "90vh", border: "1px solid black" }}
      >
        <Root grid={g}>
          <Viewport>
            <Header>
              {view.header.layout.map((row, i) => {
                return (
                  <HeaderRow headerRowIndex={i} key={i}>
                    {row.map((c) => {
                      if (c.kind === "group") {
                        return <HeaderGroupCell cell={c} key={c.idOccurrence} />;
                      }
                      return <HeaderCell cell={c} key={c.column.id} />;
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
  );
}

export const DataUpdating: StoryObj = {
  render: Component,
};
