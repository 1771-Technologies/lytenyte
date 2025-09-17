import "../../main.css";
import { useId } from "react";
import { useClientRowDataSource } from "../row-data-source-client/use-client-data-source.js";
import { bankData } from "./sample-data/bank-data.js";
import { useLyteNyte } from "../state/use-lytenyte.js";
import type { Column } from "../+types.js";
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
  { id: "job", pin: "end", width: 60 },
  { id: "balance" },
  { id: "education", width: 120 },
  { id: "marital", width: 160 },
  { id: "default", width: 220 },
  { id: "housing", width: 110 },
  { id: "loan", width: 220 },
  { id: "contact", width: 100 },
  { id: "day", width: 400 },
  { id: "month" },
  { id: "duration", width: 111 },
  { id: "campaign", width: 222 },
  { id: "pdays", width: 180 },
  { id: "previous", width: 190 },
  { id: "poutcome", width: 70 },
  { id: "y", width: 110 },
];

export default function ColumnPinning() {
  const ds = useClientRowDataSource({
    data: bankData,
    topData: bankData.slice(0, 2),
    bottomData: bankData.slice(0, 2),
  });
  const g = useLyteNyte({
    gridId: useId(),
    columns,
    rowSelectionMode: "multiple",
    rowDataSource: ds,
    columnMarkerEnabled: true,
    columnMarker: {
      width: 40,
    },
    columnBase: {
      width: 180,
      widthFlex: 0,
      uiHints: {
        resizable: true,
      },
    },
  });

  const view = g.view.useValue();

  return (
    <div className="lng-grid">
      <div style={{ width: "1128px", height: "90vh", border: "1px solid rgba(0,0,0,0.2)" }}>
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
                      return (
                        <HeaderCell cell={c} key={c.column.id} style={{ paddingInline: 20 }} />
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
  );
}
