import { useId } from "react";
import type { Column } from "../../+types";
import { useClientRowDataSource } from "../../row-data-source/use-client-data-source.js";
import { bankDataSmall } from "../sample-data/bank-data-smaller.js";
import { useLyteNyte } from "../../state/use-lytenyte.js";
import { Root } from "../../root/root.js";
import { Viewport } from "../../viewport/viewport.js";
import { Header } from "../../header/header.js";
import { HeaderRow } from "../../header/header-row.js";
import { HeaderGroupCell } from "../../header/header-group-cell.js";
import { HeaderCell } from "../../header/header-cell.js";
import { RowsContainer } from "../../rows/rows-container.js";
import { RowsBottom, RowsCenter, RowsTop } from "../../rows/rows-sections.js";
import { RowHandler } from "../sample-data/row-handler.js";

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
  { id: "poutcome", name: "P Outcome" },
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
    <div style={{ width: "100%", height: "95vh", border: "1px solid black" }}>
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
                          background: "black",
                          color: "white",
                          display: "flex",
                          alignItems: "center",
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
  );
}
