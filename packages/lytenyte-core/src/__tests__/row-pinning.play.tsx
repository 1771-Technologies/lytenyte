import "../../main.css";
import { useId } from "react";
import type { Column } from "../+types";
import { useClientRowDataSource } from "../row-data-source/use-client-data-source.js";
import { bankDataSmall } from "./sample-data/bank-data-smaller.js";
import { useLyteNyte } from "../state/use-lytenyte.js";
import { Root } from "../root/root.js";
import { Viewport } from "../viewport/viewport.js";
import { Header } from "../header/header.js";
import { HeaderRow } from "../header/header-row.js";
import { HeaderGroupCell } from "../header/header-group-cell.js";
import { HeaderCell } from "../header/header-cell.js";
import { RowsContainer } from "../rows/rows-container.js";
import { RowsBottom, RowsCenter, RowsTop } from "../rows/rows-sections.js";
import { RowHandler } from "./sample-data/row-handler.js";

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
export default function RowPinning({ pin }: { pin?: boolean }) {
  const ds = useClientRowDataSource({
    data: bankDataSmall,
    topData: pin ? bankDataSmall.slice(0, 2) : [],
    bottomData: pin ? bankDataSmall.slice(2, 4) : [],
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
      <div>
        <button onClick={() => ds.rowSetTopData(bankDataSmall.slice(0, 2))}>Pin Top</button>
        <button onClick={() => ds.rowSetBotData(bankDataSmall.slice(0, 2))}>Pin Bottom</button>
        <button onClick={() => ds.rowSetTopData([])}>Remove Top</button>
        <button onClick={() => ds.rowSetBotData([])}>Remove Bottom</button>
        <button onClick={() => ds.rowSetCenterData(bankDataSmall.slice(0, 3))}>Small</button>
        <button onClick={() => ds.rowSetCenterData([])}>Empty</button>
        <button onClick={() => ds.rowSetCenterData(bankDataSmall)}>Full</button>
      </div>
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
