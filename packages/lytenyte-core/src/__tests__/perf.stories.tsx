import "../../main.css";
import type { Meta, StoryObj } from "@storybook/react";
import { Header } from "../header/header";
import { HeaderRow } from "../header/header-row";
import { Root } from "../root/root";
import { RowsContainer } from "../rows/rows-container";
import { Viewport } from "../viewport/viewport";
import { useLyteNyte } from "../state/use-lytenyte";
import { useId } from "react";
import { HeaderCell } from "../header/header-cell";
import { HeaderGroupCell } from "../header/header-group-cell";
import { useClientRowDataSource } from "../row-data-source/use-client-data-source";
import { RowsCenter } from "../rows/rows-sections";
import { RowHandler } from "./sample-data/row-handler";

const meta: Meta = {
  title: "Grid/Performance",
};

export default meta;

const columns = Array.from({ length: 50 }, (_, i) => ({
  id: `${i}`,
  width: 30,
  widthMin: 30,
  field: i,
}));

const data = Array.from({ length: 30_000 }, () => {
  return Array.from({ length: 50 }, () => Math.round(Math.random() * 100));
});

function Component() {
  const ds = useClientRowDataSource({
    data,
  });

  const g = useLyteNyte({
    gridId: useId(),
    columns,
    rowDataSource: ds,
    rowOverscanTop: 0,
    rowOverscanBottom: 0,
    colOverscanEnd: 0,
    colOverscanStart: 0,
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
            {/* <Header>
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
              <RowsCenter>
                <RowHandler rows={view.rows.center} />
              </RowsCenter>
            </RowsContainer> */}
          </Viewport>
        </Root>
      </div>
    </div>
  );
}

export const Performance: StoryObj = {
  render: Component,
};
