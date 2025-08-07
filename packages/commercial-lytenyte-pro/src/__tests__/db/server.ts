import { sleep } from "@1771technologies/lytenyte-js-utils";
import { sql } from "./db";
import type {
  DataRequest,
  DataRequestModel,
  DataResponse,
  DataResponseBranchItem,
  DataResponseLeafItem,
  DataResponsePinned,
} from "../../+types";

export async function handleRequest(
  request: DataRequest[],
  model: DataRequestModel<any>,
): Promise<(DataResponsePinned | DataResponse)[]> {
  await sleep(1000);

  const responses = request.map<DataResponse>((c) => {
    // This is a root request
    const limit = c.end - c.start;

    const hasWhere = model.quickSearch || model.filters.length;

    const groupKey = model.group[c.path.length];
    if (groupKey) {
      const data = sql<{ childCnt: number; pathKey: string }[]>(
        `SELECT *, ${groupKey} AS pathKey, count(*) AS childCnt 
        FROM banks GROUP BY ${groupKey} LIMIT ${limit} OFFSET ${c.start}`,
      );
      const cnt = sql<{ cnt: number }[]>(
        `SELECT count(*) AS cnt FROM banks GROUP BY ${groupKey}`,
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

    const data = sql<any[]>(`
        WITH
          flat AS (
            SELECT
              *
            FROM
              banks
            ${hasWhere ? "WHERE" : ""}
            ${getQuickSearchFilter(model.quickSearch)}
            ${model.quickSearch && model.filters.length ? "AND" : ""}
            ${getOrderByClauseForSorts(model.sorts)}
            LIMIT ${limit} OFFSET ${c.start}
          )
          SELECT * FROM flat
      `);

    const count = sql<{ cnt: number }[]>(`
        WITH
          flat AS (
            SELECT
              *
            FROM
              banks
            ${hasWhere ? "WHERE" : ""}
            ${getQuickSearchFilter(model.quickSearch)}
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

  return [
    ...responses,
    {
      kind: "top",
      asOfTime: Date.now(),
      data: [
        { kind: "leaf", data: {}, id: "t-1" },
        { kind: "leaf", data: {}, id: "t-2" },
      ],
    },
    {
      kind: "bottom",
      asOfTime: Date.now(),
      data: [
        { kind: "leaf", data: {}, id: "b-1" },
        { kind: "leaf", data: {}, id: "b-2" },
      ],
    },
  ];
}

function getOrderByClauseForSorts(sorts: DataRequestModel<any>["sorts"]) {
  if (sorts.length === 0) return "";

  const orderByStrings = sorts.map((c) => `${c.columnId} ${c.isDescending ? "DESC" : "ASC"}`);

  return `
  ORDER BY
    ${orderByStrings.join(",\n")}
  `;
}

function getQuickSearchFilter(quickSearch: DataRequestModel<any>["quickSearch"]) {
  if (!quickSearch) return "";

  const qs = `'%${quickSearch}%'`;

  return `
   (job LIKE ${qs}
    OR education LIKE ${qs}
    OR marital LIKE ${qs})
  `;
}
