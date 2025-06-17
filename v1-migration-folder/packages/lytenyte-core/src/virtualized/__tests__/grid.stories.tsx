import type { Meta, StoryObj } from "@storybook/react";
import { Header } from "../header/header";
import { HeaderRow } from "../header/header-row";
import { Root } from "../root";
import { Rows } from "../rows/rows";
import { Viewport } from "../viewport/viewport";
import { useLyteNyte } from "../../state/use-lytenyte";
import { useId } from "react";
import { HeaderCell } from "../header/header-cell";
import type { Column } from "../../+types";
import { HeaderGroupCell } from "../header/header-group-cell";
import { useClientRowDataSource } from "../../row-data-source/use-client-data-source";
import { bankDataSmall } from "./sample-data/bank-data-smaller";
import { Row } from "../rows/row";
import { RowFullWidth } from "../rows/row-full-width";
import { Cell } from "../cells/cell";

const meta: Meta = {
  title: "Grid/Virtualized",
};

export default meta;

const columns: Column[] = [
  { id: "age" },
  { id: "job", groupPath: ["Alpha"] },
  { id: "balance" },
  { id: "education" },
  { id: "marital", groupPath: ["Alpha", "Beta"] },
  { id: "default", groupPath: ["Alpha", "Beta"] },
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

function MainComp() {
  const ds = useClientRowDataSource({ data: bankDataSmall });
  const g = useLyteNyte({ gridId: useId(), columns, rowDataSource: ds });

  const view = g.view.useValue();

  return (
    <div style={{ width: "1000px", height: "1000px", border: "1px solid black" }}>
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

          <Rows>
            {view.rows.layout.map((row) => {
              if (row.kind === "full-width") return <RowFullWidth row={row} key={row.rowIndex} />;

              return (
                <Row key={row.rowIndex} row={row}>
                  {row.cells.map((cell) => {
                    return (
                      <Cell
                        cell={cell}
                        key={cell.colIndex}
                        style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                      >
                        {cell.rowIndex}, {cell.colIndex}
                      </Cell>
                    );
                  })}
                </Row>
              );
            })}
          </Rows>
        </Viewport>
      </Root>
    </div>
  );
}

export const Main: StoryObj = {
  render: MainComp,
};
