import type { Column } from "../../+types.js";
import { useClientRowDataSource } from "../../row-data-source/use-client-data-source.js";
import { useLyteNyte } from "../../state/use-lytenyte.js";
import { bankDataSmall } from "../test-utils/bank-data-smaller.js";
import { Root } from "../../root/root.js";
import { Viewport } from "../../viewport/viewport.js";
import { Header } from "../../header/header.js";
import { HeaderRow } from "../../header/header-row.js";
import { HeaderGroupCell } from "../../header/header-group-cell.js";
import { HeaderCell } from "../../header/header-cell.js";
import { RowsContainer } from "../../rows/rows-container.js";
import { RowsBottom, RowsCenter, RowsTop } from "../../rows/rows-sections.js";
import { RowHandler } from "../test-utils/row-handler.js";

const baseColumns: Column<any>[] = [
  { id: "age", pin: "start" },
  { id: "job", pin: "start" },
  { id: "balance", width: 260 },
  { id: "education", width: 120 },
  { id: "marital", width: 180 },
  { id: "default" },
  { id: "housing", colSpan: 2 },
  { id: "loan" },
  { id: "contact" },
  { id: "day" },
  { id: "month" },
  { id: "duration" },
  { id: "campaign" },
  { id: "pdays" },
  { id: "previous" },
  { id: "poutcome", pin: "end" },
  { id: "y" },
];
export default function WithPins({
  rtl,
  columns,
  pinTop,
  center,
  pinBot,
  floatingRow,
}: {
  rtl?: boolean;
  columns?: Column<any>[];
  center?: number;
  pinTop?: number;
  pinBot?: number;
  floatingRow?: boolean;
}) {
  const ds = useClientRowDataSource({
    data: center ? bankDataSmall.slice(0, center) : bankDataSmall,
    topData: pinTop ? bankDataSmall.slice(0, pinTop) : [],
    bottomData: pinBot ? bankDataSmall.slice(0, pinBot) : [],
  });
  const g = useLyteNyte({
    gridId: "x",
    columns: columns ?? baseColumns,
    rowDataSource: ds,
    rtl: rtl,
    floatingRowEnabled: floatingRow,
  });

  const view = g.view.useValue();

  return (
    <div>
      <button tabIndex={0} onClick={() => {}}>
        Top Capture
      </button>
      <div style={{ width: "100%", height: "90vh", border: "1px solid black" }}>
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
                            style={{
                              paddingInline: "16px",
                              background: "light-dark(rgb(200,200,200),rgb(57, 39, 39))",
                              color: "light-dark(black,white)",
                              display: "flex",
                              alignItems: "center",
                              borderBottom: "1px solid light-dark(gray, #444242)",
                              borderRight: "1px solid light-dark(gray, #444242)",
                            }}
                          />
                        );
                      }
                      return (
                        <HeaderCell
                          cell={c}
                          key={c.column.id}
                          style={{
                            paddingInline: "16px",
                            background: "light-dark(rgb(200,200,200),rgb(57, 39, 39))",
                            color: "light-dark(black,white)",
                            display: "flex",
                            alignItems: "center",
                            borderBottom: "1px solid light-dark(gray, #444242)",
                            borderRight: "1px solid light-dark(gray, #444242)",
                          }}
                        />
                      );
                    })}
                  </HeaderRow>
                );
              })}
            </Header>

            <RowsContainer>
              <RowsTop>
                <RowHandler rows={view.rows.top} withStyles pinned />
              </RowsTop>

              <RowsCenter>
                <RowHandler rows={view.rows.center} withStyles />
              </RowsCenter>

              <RowsBottom>
                <RowHandler rows={view.rows.bottom} withStyles pinned />
              </RowsBottom>
            </RowsContainer>
          </Viewport>
        </Root>
      </div>
      <button tabIndex={0} onClick={() => {}}>
        Bottom Capture
      </button>
    </div>
  );
}
