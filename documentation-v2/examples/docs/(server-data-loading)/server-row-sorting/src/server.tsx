import type { DataRequest, DataResponse } from "@1771technologies/lytenyte-pro-experimental";
import type { MovieData } from "./data";
import { data as rawData } from "./data.js";

const sleep = () => new Promise((res) => setTimeout(res, 600));

export async function Server(
  reqs: DataRequest[],
  sortModel: { columnId: string; isDescending: boolean } | null,
) {
  // Simulate latency and server work.
  await sleep();

  let data = rawData;

  if (sortModel) {
    data = rawData.toSorted((l, r) => {
      const id = sortModel.columnId as keyof MovieData;

      const leftValue = l[id];
      const rightValue = r[id];

      // Check null states before moving on to checking sort values
      if (!leftValue && !rightValue) return 0;
      else if (leftValue && !rightValue) return -1;
      else if (!leftValue && rightValue) return 1;

      let val = 0;
      if (id === "link" || id === "name" || id === "genre" || id === "type") {
        val = leftValue.localeCompare(rightValue);
      } else if (id === "released_at") {
        if (!leftValue && !rightValue) val = 0;
        else if (leftValue && !rightValue) val = -1;
        else if (!leftValue && rightValue) val = 1;
        else {
          const leftDate = new Date(leftValue);
          const rightDate = new Date(rightValue);

          if (leftDate < rightDate) val = -1;
          else if (leftDate > rightDate) val = 1;
          else val = 0;
        }
      } else if (id === "imdb_rating") {
        const left = Number.parseFloat(leftValue.split("/")[0]);
        const right = Number.parseFloat(rightValue.split("/")[0]);

        val = left - right;
      }

      if (val !== 0) return sortModel.isDescending ? -val : val;

      return val;
    });
  }

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
