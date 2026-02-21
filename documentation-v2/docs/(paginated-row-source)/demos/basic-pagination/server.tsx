import type { DataRequest, DataResponse } from "@1771technologies/lytenyte-pro";
import { data } from "./data.js";

const sleep = () => new Promise((res) => setTimeout(res, 200));

export async function Server(reqs: DataRequest[], page: number, pageSize: number) {
  // Simulate latency and server work.
  await sleep();

  const pageStart = page * pageSize;

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
    count: data.length,
  };
}
