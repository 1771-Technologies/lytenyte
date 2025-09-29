import "./navigation.css";
import type { Column } from "../../+types.js";
import { useLyteNyte } from "../../state/use-lytenyte.js";
import { bankDataSmall } from "../test-utils/bank-data-smaller.js";
import { Root } from "../../grid/root.js";
import { Viewport } from "../../grid/viewport.js";
import { Header } from "../../grid/header.js";
import { HeaderRow } from "../../grid/header-row.js";
import { HeaderGroupCell } from "../../grid/header-group-cell.js";
import { HeaderCell } from "../../grid/header-cell.js";
import { RowsContainer } from "../../grid/rows-container.js";
import { RowsBottom, RowsCenter, RowsTop } from "../../grid/rows-sections.js";
import { RowHandler } from "../test-utils/row-handler.js";
import { useClientRowDataSource } from "../../row-data-source-client/use-client-data-source.js";

const baseColumns: Column<any>[] = [
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
export default function FullWidthRows({
  rtl,
  columns,
}: {
  rtl?: boolean;
  columns?: Column<any>[];
}) {
  const ds = useClientRowDataSource({
    data: bankDataSmall,
  });
  const g = useLyteNyte({
    gridId: "x",
    columns: columns ?? baseColumns,
    rowDataSource: ds,
    rtl: rtl,
    rowFullWidthPredicate: (r) => r.rowIndex === 2 || r.rowIndex == 4,
    rowFullWidthRenderer: (r) => {
      if (r.rowIndex === 2) return <div>Nothing</div>;

      return (
        <div>
          <button tabIndex={0}>A</button>
          <button tabIndex={0}>B</button>
          <button tabIndex={0}>C</button>
        </div>
      );
    },
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
                        return <HeaderGroupCell cell={c} key={c.idOccurrence} />;
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
