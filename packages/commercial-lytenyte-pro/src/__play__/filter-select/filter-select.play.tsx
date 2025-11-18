import "../../../main.css";
import { useClientRowDataSource } from "../../row-data-source-client/use-client-data-source.js";
import { useLyteNyte } from "../../state/use-lytenyte.js";
import { useId } from "react";
import { Viewport } from "../../grid/viewport.js";
import { Root } from "../../grid/root.js";
import { Header } from "../../grid/header.js";
import { HeaderRow } from "../../grid/header-row.js";
import { HeaderGroupCell } from "../../grid/header-group-cell.js";
import { HeaderCell } from "../../grid/header-cell.js";
import { RowsContainer } from "../../grid/rows-container.js";
import { RowsBottom, RowsCenter, RowsTop } from "../../grid/rows-sections.js";
import { RowHandler } from "../test-utils/row-handler.js";
import { bankDataSmall } from "../test-utils/bank-data-smaller.js";
import type { Column } from "../../+types";
import { FilterSelect } from "../../filter-selects/index.js";

const columns: Column<any>[] = [
  { id: "age", type: "number" },
  { id: "job", type: "date" },
  { id: "balance", pin: "start" },
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

export default function FilterSelection({ data = bankDataSmall }: { data?: any[] }) {
  const ds = useClientRowDataSource({
    data: data,
  });

  const g = useLyteNyte({
    gridId: useId(),
    columns,
    rowDataSource: ds,
  });

  const view = g.view.useValue();

  const rootAge = FilterSelect.useFilterSelect({ grid: g, column: columns[0], maxCount: 3 });
  const rootJob = FilterSelect.useFilterSelect({ grid: g, column: columns[1], maxCount: 3 });

  return (
    <div style={{ display: "flex" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div>
          <FilterSelect.Root root={rootAge}>
            {rootAge.filters.map((c, i) => {
              return (
                <FilterSelect.FilterRow filter={c} key={i}>
                  <FilterSelect.OperatorSelect />
                  <FilterSelect.ValueInput />
                  <FilterSelect.FilterCombinator />
                </FilterSelect.FilterRow>
              );
            })}
            <FilterSelect.Apply />
            <FilterSelect.Reset />
          </FilterSelect.Root>
        </div>
        <div>
          <FilterSelect.Root root={rootJob}>
            {rootJob.filters.map((c, i) => {
              return (
                <FilterSelect.FilterRow filter={c} key={i}>
                  <FilterSelect.OperatorSelect />
                  <FilterSelect.ValueInput />
                  <FilterSelect.FilterCombinator />
                </FilterSelect.FilterRow>
              );
            })}
            <FilterSelect.Apply />
            <FilterSelect.Reset />
          </FilterSelect.Root>
        </div>
      </div>
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
    </div>
  );
}
