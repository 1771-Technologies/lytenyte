import "./navigation.css";
import { useId } from "react";
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
