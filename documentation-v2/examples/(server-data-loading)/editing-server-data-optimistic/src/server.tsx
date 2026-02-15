import type { DataRequest, DataResponse } from "@1771technologies/lytenyte-pro/types";

import type { SalaryData } from "./data";
import { data as rawData } from "./data.js";

const sleep = (n = 4000) => new Promise((res) => setTimeout(res, n));

export async function handleUpdate(updates: Map<string, SalaryData>, resetKey: string) {
  await sleep(200);

  const data = dataMaps[resetKey]!;

  updates.forEach((x, id) => {
    const row = data.find((c) => c.id === id);
    if (!row) return;

    Object.assign(row, x);
  });
}

let dataMaps: Record<string, SalaryData[]> = {};

export async function Server(reqs: DataRequest[], resetKey: string) {
  if (!dataMaps[resetKey]) {
    dataMaps = { [resetKey]: structuredClone(rawData) };
  }
  const data = dataMaps[resetKey];
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
