"use client";

import { bankDataSmall as bankData } from "@1771technologies/sample-data/bank-data-smaller";
import { Grid, useServerDataSource } from "@1771technologies/lytenyte-pro";
import "@1771technologies/lytenyte-pro/grid.css";
import type {
  Column,
  DataRequest,
  DataRequestModel,
  DataResponse,
  DataResponseBranchItem,
  DataResponseLeafItem,
  DataResponsePinned,
} from "@1771technologies/lytenyte-pro/types";
import type { bankDataSmall } from "@1771technologies/sample-data/bank-data-smaller";
import { useId } from "react";
import sql from "alasql";

type BankData = (typeof bankDataSmall)[number];

const columns: Column<BankData>[] = [
  { id: "age", type: "number" },
  { id: "job", hide: true },
  { id: "balance", type: "number" },
  { id: "education" },
  { id: "marital" },
  { id: "default" },
  { id: "housing" },
];

export default function App() {
  const ds = useServerDataSource<BankData>({
    dataFetcher: async (p) => {
      const res = await handleRequest(p.requests, p.model);
      return res;
    },
  });

  const grid = Grid.useLyteNyte({
    gridId: useId(),
    rowDataSource: ds,
    columns,
  });

  const view = grid.view.useValue();

  return (
    <div className="lng-grid" style={{ height: 500 }}>
      <Grid.Root grid={grid}>
        <Grid.Viewport>
          <Grid.Header>
            {view.header.layout.map((row, i) => {
              return (
                <Grid.HeaderRow key={i} headerRowIndex={i}>
                  {row.map((c) => {
                    if (c.kind === "group") return null;

                    return (
                      <Grid.HeaderCell
                        key={c.id}
                        cell={c}
                        className="flex w-full h-full capitalize px-2 items-center"
                      />
                    );
                  })}
                </Grid.HeaderRow>
              );
            })}
          </Grid.Header>
          <Grid.RowsContainer>
            <Grid.RowsCenter>
              {view.rows.center.map((row) => {
                if (row.kind === "full-width") return null;

                return (
                  <Grid.Row row={row} key={row.id}>
                    {row.cells.map((c) => {
                      return (
                        <Grid.Cell
                          key={c.id}
                          cell={c}
                          className="text-sm flex items-center px-2 h-full w-full"
                        />
                      );
                    })}
                  </Grid.Row>
                );
              })}
            </Grid.RowsCenter>
          </Grid.RowsContainer>
        </Grid.Viewport>
      </Grid.Root>
    </div>
  );
}

// Create our server db. This is for illustration purposes only

sql(`
CREATE TABLE IF NOT EXISTS banks
 (
    age number,
    job string,
    balance number,
    education string,
    marital string,
    _default string,
    housing string,
    loan string,
    contact string,
    day number,
    month string,
    duration number,
    campaign number,
    pdays number,
    previous number,
    poutcome string,
    y string
 )
`);

sql.tables.banks.data = bankData;

export async function handleRequest(
  request: DataRequest[],
  model: DataRequestModel<any>
): Promise<(DataResponsePinned | DataResponse)[]> {
  // simulate wait
  await new Promise((res) => setTimeout(res, 400));

  const responses = request.map<DataResponse>((c) => {
    // This is a root request
    const limit = c.end - c.start;

    const hasWhere = model.quickSearch || model.filters.length;

    const groupKey = model.groups[c.path.length];
    if (groupKey) {
      const data = sql<{ childCnt: number; pathKey: string }[]>(
        `SELECT *, ${groupKey} AS pathKey, count(*) AS childCnt 
        FROM banks GROUP BY ${groupKey}`
      ).slice(c.start, c.start + limit);
      const cnt = sql<{ cnt: number }[]>(
        `SELECT count(*) AS cnt FROM banks GROUP BY ${groupKey}`
      ).length;

      return {
        asOfTime: Date.now(),
        data: data.map<DataResponseBranchItem>((row, i) => {
          return {
            kind: "branch",
            childCount: row.childCnt,
            data: row,
            id: `${c.path.join("/")}__${i + c.start}`,
            key: row.pathKey,
          };
        }),
        start: c.start,
        end: c.end,
        kind: "center",
        path: c.path,
        size: cnt,
      };
    }

    const groupFilter = [];
    for (let i = 0; i < c.path.length; i++) {
      const group = model.groups[i];
      const groupKey = typeof group === "string" ? group : group.id;
      groupFilter.push(
        `${groupKey} = ${
          typeof c.path[i] === "string" ? `'${c.path[i]}'` : c.path[i]
        }`
      );
    }

    const data = sql<any[]>(`
        WITH
          flat AS (
            SELECT
              *
            FROM
              banks
            ${hasWhere ? "WHERE" : ""}
            ${getQuickSearchFilter(model.quickSearch)}
            ${
              !hasWhere && groupFilter.length
                ? " WHERE " + groupFilter.join("\n AND ")
                : groupFilter.length
                ? " AND " + groupFilter.join("\n AND")
                : ""
            }
            ${model.quickSearch && model.filters.length ? "AND" : ""}
            ${getOrderByClauseForSorts(model.sorts)}
          )
          SELECT * FROM flat
      `).slice(c.start, c.start + limit);

    const count = sql<{ cnt: number }[]>(`
        WITH
          flat AS (
            SELECT
              *
            FROM
              banks
            ${hasWhere ? "WHERE" : ""}
            ${getQuickSearchFilter(model.quickSearch)}
            ${
              !hasWhere && groupFilter.length
                ? " WHERE " + groupFilter.join("\n AND ")
                : groupFilter.length
                ? " AND " + groupFilter.join("\n AND")
                : ""
            }
            ${model.quickSearch && model.filters.length ? "AND" : ""}
            ${getOrderByClauseForSorts(model.sorts)}
          )
      SELECT count(*) as cnt FROM flat
    `)[0].cnt;

    return {
      asOfTime: Date.now(),
      data: data.map<DataResponseLeafItem>((row, i) => {
        return {
          data: row,
          id: `${c.path.join("-->")}${i + c.start}`,
          kind: "leaf",
        };
      }),
      start: c.start,
      end: c.end,
      kind: "center",
      path: c.path,
      size: count,
    };
  });

  return [...responses];
}

function getOrderByClauseForSorts(sorts: DataRequestModel<any>["sorts"]) {
  if (sorts.length === 0) return "";

  const orderByStrings = sorts.map(
    (c) => `${c.columnId} ${c.isDescending ? "DESC" : "ASC"}`
  );

  return `
  ORDER BY
    ${orderByStrings.join(",\n")}
  `;
}

function getQuickSearchFilter(
  quickSearch: DataRequestModel<any>["quickSearch"]
) {
  if (!quickSearch) return "";

  const qs = `'%${quickSearch}%'`;

  return `
   (job LIKE ${qs}
    OR education LIKE ${qs}
    OR marital LIKE ${qs})
  `;
}
