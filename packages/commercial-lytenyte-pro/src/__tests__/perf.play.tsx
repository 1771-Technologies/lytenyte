import "../../main.css";
import { Header } from "../header/header";
import { HeaderRow } from "../header/header-row";
import { Root } from "../root/root";
import { RowsContainer } from "../rows/rows-container";
import { Viewport } from "../viewport/viewport";
import { useLyteNyte } from "../state/use-lytenyte";
import { useId } from "react";
import { HeaderCell } from "../header/header-cell";
import { HeaderGroupCell } from "../header/header-group-cell";
import { RowsBottom, RowsCenter, RowsTop } from "../rows/rows-sections";
import { RowHandler } from "./sample-data/row-handler";
import { useClientRowDataSource } from "../row-data-source-client/use-client-data-source";

const columns = Array.from({ length: 50 }, (_, i) => ({
  id: `${i}`,
  // rowSpan: i === 1 ? 3 : undefined,
  width: 30,
  widthMin: 30,
  field: i,

  uiHints: {
    resizable: true,
  },
}));

const data = Array.from({ length: 30_000 }, (_, r) => {
  return Array.from({ length: 50 }, (_, i) => (i === 0 ? r : Math.round(Math.random() * 100)));
});

export default function Component() {
  const ds = useClientRowDataSource({
    data: data,
  });

  const g = useLyteNyte({
    gridId: useId(),
    columns,
    rowDataSource: ds,
    // rowOverscanTop: 0,
    // rowOverscanBottom: 0,
    // colOverscanEnd: 0,
    // colOverscanStart: 0,
    rowHeight: 20,
  });

  const view = g.view.useValue();

  return (
    <div>
      <div>
        <button onClick={() => g.state.rtl.set((prev) => !prev)}>
          RTL: {g.state.rtl.get() ? "Yes" : "No"}
        </button>
      </div>
      <div></div>

      <div
        className="lng-grid"
        style={{ width: "100%", height: "90vh", border: "1px solid black" }}
      >
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
                          onClick={() => {
                            const current = g.api.sortForColumn(c.column.id);

                            if (current == null) {
                              g.state.sortModel.set([
                                {
                                  columnId: c.column.id,
                                  sort: { kind: "string" },
                                  isDescending: false,
                                },
                              ]);
                              return;
                            }
                            if (!current.sort.isDescending) {
                              g.state.sortModel.set([{ ...current.sort, isDescending: true }]);
                            } else {
                              g.state.sortModel.set([]);
                            }
                          }}
                          key={c.column.id}
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
    </div>
  );
}
