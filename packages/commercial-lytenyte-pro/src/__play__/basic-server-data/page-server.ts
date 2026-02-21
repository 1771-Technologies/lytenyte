import type { DataRequest, DataResponse } from "../../data-source-server/types.js";
import { data } from "./page-data.js";

const sleep = () => new Promise((res) => setTimeout(res, 600));

export async function Server(reqs: DataRequest[], page: number, pageSize: number) {
  // Simulate latency and server work.
  await sleep();

  const pageCount = Math.ceil(data.length / pageSize);

  const pageStart = page * pageCount;

  const pages = reqs.map((c) => {
    return {
      asOfTime: Date.now(),
      data: data.slice(pageStart, pageStart + pageSize).map((x) => {
        return { kind: "leaf", id: x.uniq_id, data: x };
      }),
      start: c.start,
      end: c.end,
      kind: "center",
      path: c.path,
      size: pageSize,
    } satisfies DataResponse;
  });

  return {
    pages,
    pageCount,
  };
}
