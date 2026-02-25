import type { DataRequest, DataResponse } from "@1771technologies/lytenyte-pro";
import { data } from "./data.js";

const sleep = () => new Promise((res) => setTimeout(res, 200));

export async function Server(reqs: DataRequest[], page: number, pageSize: number | "All") {
  // Simulate latency and server work.
  await sleep();

  const start = pageSize === "All" ? 0 : page * pageSize;
  const end = pageSize === "All" ? data.length : start + pageSize;

  const pages = reqs.map((c) => {
    const pageData = data.slice(start, end);

    return {
      asOfTime: Date.now(),
      data: pageData.map((x) => {
        return { kind: "leaf", id: x.uniq_id, data: x };
      }),
      start: c.start,
      end: c.end,
      kind: "center",
      path: c.path,
      size: Math.min(pageSize === "All" ? pageData.length : pageSize, pageData.length),
    } satisfies DataResponse;
  });

  return {
    pages,
    count: data.length,
  };
}
