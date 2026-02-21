import type { DataRequest, DataResponse } from "@1771technologies/lytenyte-pro";
import { data as rawData, type MovieData } from "./data.js";

const sleep = () => new Promise((res) => setTimeout(res, 200));

export async function Server(
  reqs: DataRequest[],
  page: number,
  pageSize: number,
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
