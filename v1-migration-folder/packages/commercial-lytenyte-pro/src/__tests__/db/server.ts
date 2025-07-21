import { sleep } from "@1771technologies/lytenyte-js-utils";
import type {
  DataRequest,
  DataRequestModel,
  DataResponse,
  DataResponseLeafItem,
} from "../../row-data-source-server/+types";
import { sql } from "./db";
import type { FilterModelItem } from "../../+types";

export async function handleRequest(request: DataRequest[], model: DataRequestModel<any>) {
  await sleep(200);

  const responses = request.map<DataResponse>((c) => {
    // This is a root request
    const limit = c.end - c.start;

    const hasWhere = model.quickSearch || model.filters.length;

    const mainQueryBody = `
        WITH
          flat AS (
            SELECT
              *
            FROM
              banks
            ${hasWhere ? "WHERE" : ""}
            ${getQuickSearchFilter(model.quickSearch)}
            ${model.quickSearch && model.filters.length ? "AND" : ""}
            ${getFilterContent(model.filters)}
            ${getOrderByClauseForSorts(model.sorts)}
            LIMIT_STRING
          )
    `;

    const data = sql<any[]>(`
          ${mainQueryBody.replace("LIMIT_STRING", `LIMIT ${limit} OFFSET ${c.start}`)}
          SELECT * FROM flat
      `);

    const count = sql<{ cnt: number }[]>(`
      ${mainQueryBody.replace("LIMIT_STRING", "")}
      SELECT count(*) as cnt FROM flat
    `)[0].cnt;

    return {
      asOfTime: Date.now(),
      data: data.map<DataResponseLeafItem>((row, i) => {
        return {
          data: row,
          id: `${c.path.join("-->")}${i}`,
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

  return responses;
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

function getFilterContent(filter: DataRequestModel<any>["filters"]) {
  const handleFilter = (filter: FilterModelItem<any>) => {
    if (filter.kind === "func")
      throw new Error("Server model doesn't normally support function filters");

    if (filter.kind === "in") {
      return `${filter.field} ${filter.operator === "in" ? "IN" : "NOT IN"} (${[...filter.value].map((c) => `'${c}'`).join(",")})`;
    }

    return "";
  };

  return filter.map(handleFilter).join("AND ");
}
