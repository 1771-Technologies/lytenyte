import type { Meta, StoryObj } from "@storybook/react";
import { Header } from "../header/header";
import { HeaderRow } from "../header/header-row";
import { Root } from "../root";
import { RowsContainer } from "../rows/rows";
import { Viewport } from "../viewport/viewport";
import { useLyteNyte } from "../../state/use-lytenyte";
import { useId } from "react";
import { HeaderCell } from "../header/header-cell";
import type { Column, RowLayout } from "../../+types";
import { HeaderGroupCell } from "../header/header-group-cell";
import { useClientRowDataSource } from "../../row-data-source/use-client-data-source";
import { bankDataSmall } from "./sample-data/bank-data-smaller";
import { Row } from "../rows/row";
import { RowFullWidth } from "../rows/row-full-width";
import { Cell } from "../cells/cell";
import { RowsBottom, RowsCenter, RowsTop } from "../rows/rows-sections";
import { RowScrollForcePassive } from "../rows/row-scroll-force-passive";

const meta: Meta = {
  title: "Grid/Virtualized",
};

export default meta;

const columns: Column[] = [
  { id: "age" },
  { id: "job", groupPath: ["Alpha"] },
  { id: "balance" },
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
  { id: "poutcome" },
  { id: "y" },
];

function RowHandler(props: { rows: RowLayout[] }) {
  return props.rows.map((row) => {
    if (row.kind === "full-width") return <RowFullWidth row={row} key={row.rowIndex} />;

    return (
      <Row key={row.rowIndex} row={row}>
        {row.cells.map((cell) => {
          return (
            <Cell
              cell={cell}
              key={cell.colIndex}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "white",
                border: "1px solid black",
              }}
            >
              {cell.rowIndex}, {cell.colIndex}
            </Cell>
          );
        })}
      </Row>
    );
  });
}

function MainComp() {
  const ds = useClientRowDataSource({
    data: bankDataSmall,
  });
  const g = useLyteNyte({ gridId: useId(), columns, rowDataSource: ds });

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
            <RowScrollForcePassive>
              <RowsCenter>
                <RowHandler rows={view.rows.center} />
              </RowsCenter>
            </RowScrollForcePassive>
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
