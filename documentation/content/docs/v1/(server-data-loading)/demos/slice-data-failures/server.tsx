import type { DataRequest, DataResponse } from "@1771technologies/lytenyte-pro/types";

import { data } from "./data";

const sleep = () => new Promise((res) => setTimeout(res, 600));

export async function Server(reqs: DataRequest[], fail: { current: Record<string, boolean> }) {
  // Simulate latency and server work.
  await sleep();

  return reqs.map((c) => {
    if (c.start > 0 && fail.current[c.id] != false) {
      fail.current[c.id] = false;
      throw new Error("Simulate failure");
    }

    return {
      asOfTime: Date.now(),
      data: data.slice(c.start, c.end).map((x) => {
        return {
          kind: "leaf",
          id: x.uniq_id,
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
