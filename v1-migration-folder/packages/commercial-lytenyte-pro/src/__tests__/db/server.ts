import type {
  DataRequest,
  DataResponse,
  DataResponseLeafItem,
} from "../../row-data-source-server/+types";
import { sql } from "./db";

export async function handleRequest(request: DataRequest[]) {
  const responses = request.map<DataResponse>((c) => {
    // This is a root request
    const limit = c.end - c.start;

    const data = sql<any[]>(`
        SELECT
          *
        FROM
          banks
        LIMIT ${limit} OFFSET ${c.start}
      `);

    const count = sql<{ cnt: number }[]>(`SELECT count(*) as cnt FROM banks`)[0].cnt;

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
