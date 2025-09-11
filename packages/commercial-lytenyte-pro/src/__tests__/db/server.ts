import { sleep } from "@1771technologies/lytenyte-js-utils";
import { sql } from "./db.js";
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
  await sleep(request[0].path.length > 0 ? 400 : 400);

  const responses = request.map<DataResponse>((c) => {
    // This is a root request
    const limit = c.end - c.start;

    const hasWhere = model.quickSearch || model.filters.length;

    const groupKey = model.groups[c.path.length];
    if (groupKey) {
      const data = sql<{ childCnt: number; pathKey: string }[]>(
        `SELECT *, ${groupKey} AS pathKey, count(*) AS childCnt 
        FROM banks GROUP BY ${groupKey}`,
      ).slice(c.start, c.start + limit);
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

    const groupFilter = [];
    for (let i = 0; i < c.path.length; i++) {
      const group = model.groups[i];
      const groupKey = typeof group === "string" ? group : group.id;
      groupFilter.push(
        `${groupKey} = ${typeof c.path[i] === "string" ? `'${c.path[i]}'` : c.path[i]}`,
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
            ${!hasWhere && groupFilter.length ? " WHERE " + groupFilter.join("\n AND ") : groupFilter.length ? " AND " + groupFilter.join("\n AND") : ""}
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
            ${!hasWhere && groupFilter.length ? " WHERE " + groupFilter.join("\n AND ") : groupFilter.length ? " AND " + groupFilter.join("\n AND") : ""}
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
        { kind: "leaf", data: {}, id: "top-1" },
        { kind: "leaf", data: {}, id: "top-2" },
      ],
    },
    {
      kind: "bottom",
      asOfTime: Date.now(),
      data: [
        { kind: "leaf", data: {}, id: "bottom-1" },
        { kind: "leaf", data: {}, id: "bottom-2" },
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
