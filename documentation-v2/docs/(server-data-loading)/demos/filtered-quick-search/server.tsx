import type { DataRequest, DataResponse } from "@1771technologies/lytenyte-pro/types";

import { data as movieData } from "./data";

const sleep = () => new Promise((res) => setTimeout(res, 600));

export async function Server(reqs: DataRequest[], quickSearchValue: string | null) {
  // Simulate latency and server work.
  await sleep();

  const data = !quickSearchValue
    ? movieData
    : movieData.filter((row) => {
        const values = [row.released_at, row.genre, row.name, row.type];
        const searchStr = values.join(" ").toLowerCase();

        return searchStr.includes(quickSearchValue.toLowerCase());
      });

  return reqs.map((c) => {
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
