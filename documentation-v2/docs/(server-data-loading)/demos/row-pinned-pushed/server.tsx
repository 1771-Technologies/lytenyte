import type { DataRequest, DataResponse } from "@1771technologies/lytenyte-pro-experimental";
import { data as movieData } from "./data.js";

const sleep = () => new Promise((res) => setTimeout(res, 600));

export async function Server(reqs: DataRequest[]): Promise<DataResponse[]> {
  // Simulate latency and server work.
  await sleep();

  const data = movieData.slice(1);

  return [
    // Normal data row responses
    ...reqs.map((c) => {
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
    }),
  ];
}
