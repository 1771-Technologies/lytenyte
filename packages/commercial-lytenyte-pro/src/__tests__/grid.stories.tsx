import type { Meta, StoryObj } from "@storybook/react";
import { Header } from "../header/header.js";
import { HeaderRow } from "../header/header-row.js";
import { Root } from "../root/root.js";
import { RowsContainer } from "../rows/rows-container.js";
import { Viewport } from "../viewport/viewport.js";
import { useLyteNyte } from "../state/use-lytenyte.js";
import { useId } from "react";
import { HeaderCell } from "../header/header-cell.js";
import type { Column } from "../+types";
import { HeaderGroupCell } from "../header/header-group-cell.js";
import { useClientRowDataSource } from "../row-data-source-client/use-client-data-source.js";
import { bankDataSmall } from "./sample-data/bank-data-smaller.js";
import { RowsBottom, RowsCenter, RowsTop } from "../rows/rows-sections.js";
import { RowHandler } from "./sample-data/row-handler.js";

const meta: Meta = {
  title: "Grid/Virtualized",
};

export default meta;

const columns: Column<any>[] = [
  { id: "age", colSpan: 2 },
  { id: "job", groupPath: ["Alpha"] },
  { id: "balance", rowSpan: 3 },
  { id: "education", pin: "start" },
  { id: "marital", groupPath: ["Alpha", "Beta"], pin: "start" },
  { id: "default", groupPath: ["Alpha", "Beta"] },
  { id: "housing" },
  { id: "loan" },
  { id: "contact", pin: "end" },
  { id: "day" },
  { id: "month", groupPath: ["Xeno"], pin: "end", width: 100 },
  { id: "duration" },
  { id: "campaign" },
  { id: "pdays" },
  { id: "previous" },
  { id: "poutcome", name: "P Outcome" },
  { id: "y" },
];

function MainComp() {
  const ds = useClientRowDataSource({
    data: bankDataSmall,
  });
  const g = useLyteNyte({
    gridId: useId(),
    columns,
    rowDataSource: ds,
    rowFullWidthPredicate: (r) => r.row.data.age == 20,

    sortModel: [
      {
        columnId: "education",
        sort: {
          kind: "string",
        },
      },
    ],
  });

  const view = g.view.useValue();

  return (
    <div style={{ width: "100%", height: "95vh", border: "1px solid black" }}>
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
  );
}

export const Main: StoryObj = {
  render: MainComp,
};
