import type {
  DataRequest,
  DataResponse,
  SortModelItem,
} from "@1771technologies/lytenyte-pro/types";

import type { MovieData } from "./data";
import { data as rawData } from "./data";

const sleep = () => new Promise((res) => setTimeout(res, 600));

export async function Server(reqs: DataRequest[], sortModel: SortModelItem<MovieData>[]) {
  // Simulate latency and server work.
  await sleep();

  let data = rawData;

  if (sortModel.length) {
    data = rawData.toSorted((l, r) => {
      for (const m of sortModel) {
        if (m.sort.kind === "custom")
          throw new Error("This server implementation does not support custom sorts");

        const id = m.columnId as keyof MovieData;

        // Notice we are ignoring the sort type on the SortModelItem. This is common
        // when sorting on the server, since the server already has knowledge of the
        // columns data type
        const leftValue = l[id];
        const rightValue = r[id];

        // Check null states before moving on to checking sort values
        if (!leftValue && !rightValue) continue;
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

        if (val !== 0) return m.isDescending ? -val : val;
      }

      return 0;
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
