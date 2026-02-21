import type { DataRequest, DataResponse } from "@1771technologies/lytenyte-pro";
import { data } from "./data.js";

const sleep = () => new Promise((res) => setTimeout(res, 200));

export async function Server(reqs: DataRequest[], page: number, pageSize: number) {
  // Simulate latency and server work.
  await sleep();

  const pageStart = page * pageSize;

  const pages = reqs.map((c) => {
    const pageData = data.slice(pageStart, pageStart + pageSize);

    return {
      asOfTime: Date.now(),
      data: pageData.map((x) => {
        return { kind: "leaf", id: x.uniq_id, data: x };
      }),
      start: c.start,
      end: c.end,
      kind: "center",
      path: c.path,
      size: Math.min(pageSize, pageData.length),
    } satisfies DataResponse;
  });

  return {
    pages,
    count: data.length,
  };
}
