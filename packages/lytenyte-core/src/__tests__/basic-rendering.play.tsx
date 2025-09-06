import "../../main.css";
import { useId } from "react";
import type { Column } from "../+types";
import { useClientRowDataSource } from "../row-data-source/use-client-data-source";
import { bankDataSmall } from "./sample-data/bank-data-smaller";
import { useLyteNyte } from "../state/use-lytenyte";
import { Root } from "../root/root";
import { Viewport } from "../viewport/viewport";
import { Header } from "../header/header";
import { HeaderRow } from "../header/header-row";
import { HeaderGroupCell } from "../header/header-group-cell";
import { HeaderCell } from "../header/header-cell";
import { RowsContainer } from "../rows/rows-container";
import { RowsBottom, RowsCenter, RowsTop } from "../rows/rows-sections";
import { RowHandler } from "./sample-data/row-handler";

const columns: Column<any>[] = [
  { id: "age" },
  { id: "job" },
  { id: "balance" },
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
export default function BasicRendering() {
  const ds = useClientRowDataSource({
    data: bankDataSmall,
  });
  const g = useLyteNyte({
    gridId: useId(),
    columns,
    rowDataSource: ds,

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
    <div className="lng-grid" style={{ width: "100%", height: "95vh", border: "1px solid black" }}>
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
  );
}
