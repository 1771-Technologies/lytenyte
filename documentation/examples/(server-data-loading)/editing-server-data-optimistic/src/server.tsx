import type { DataRequest, DataResponse } from "@1771technologies/lytenyte-pro/types";

import type { SalaryData } from "./data";
import { data } from "./data";

const sleep = (n = 600) => new Promise((res) => setTimeout(res, n));

export async function handleUpdate(updates: Map<string, SalaryData>) {
  await sleep(200);

  updates.forEach((x, id) => {
    const row = data.find((c) => c.id === id);
    if (!row) return;

    Object.assign(row, x);
  });
}

export async function Server(reqs: DataRequest[]) {
  // Simulate latency and server work.
  await sleep();

  return reqs.map((c) => {
    return {
      asOfTime: Date.now(),
      data: data.slice(c.start, c.end).map((x) => {
        return {
          kind: "leaf",
          id: x.id,
          data: x,
        };
      }),
      start: c.start,
      end: c.end,
      kind: "center",
      path: c.path,
      size: data.length,
    } satisfies DataResponse;
  });
}
