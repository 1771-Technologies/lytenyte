import type {
  DataRequest,
  DataResponse,
  DataResponsePinned,
} from "@1771technologies/lytenyte-pro-experimental";
import { data } from "./data.js";

const sleep = () => new Promise((res) => setTimeout(res, 600));

export async function Server(reqs: DataRequest[]): Promise<(DataResponse | DataResponsePinned)[]> {
  // Simulate latency and server work.
  await sleep();

  const top = data.slice(0, 2);
  const bottom = data.slice(2, 4);
  const final = data.slice(4);

  return [
    {
      kind: "top",
      asOfTime: Date.now(),
      data: top.map((x) => ({ kind: "leaf", id: x.uniq_id, data: x })),
    },
    {
      kind: "bottom",
      asOfTime: Date.now(),
      data: bottom.map((x) => ({ kind: "leaf", id: x.uniq_id, data: x })),
    },

    // Normal data row responses
    ...reqs.map((c) => {
      return {
        asOfTime: Date.now(),
        data: final.slice(c.start, c.end).map((x) => {
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
        size: final.length,
      } satisfies DataResponse;
    }),
  ];
}
