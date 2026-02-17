import type {
  DataRequest,
  DataResponse,
  FilterModelItem,
} from "@1771technologies/lytenyte-pro/types";

import type { MovieData } from "./data";
import { data as movieData } from "./data";

const sleep = () => new Promise((res) => setTimeout(res, 600));

export async function Server(
  reqs: DataRequest[],
  filterModel: Record<string, FilterModelItem<MovieData>>,
) {
  // Simulate latency and server work.
  await sleep();

  const filters = Object.entries(filterModel);

  const data =
    filters.length === 0
      ? movieData
      : movieData.filter((row) => {
          for (const [columnId, filter] of filters) {
            // Our logic here only handles a small subset of the possible filter functionality
            // for ease of implementation.
            if (filter.kind !== "string" && filter.kind !== "date") return false;

            const value = row[columnId as keyof MovieData];
            if (!value) return false;

            if (columnId === "imdb_rating") {
              const rating = value ? Math.round(Number.parseFloat(value.split("/")[0]) / 2) : "";
              const v = rating as number;
              const filterV =
                typeof filter.value === "string"
                  ? Number.parseInt(filter.value)
                  : (filter.value as number);

              if (filter.operator === "equals" && v !== filterV) return false;
              if (filter.operator === "not_equals" && v === filterV) return false;
              if (filter.operator === "less_than" && v >= filterV) return false;
              if (filter.operator === "greater_than" && v <= filterV) return false;
              continue;
            }

            if (columnId === "released_at") {
              const v = new Date(value);
              const filterV = new Date(filter.value as string);

              if (filter.operator === "before" && v >= filterV) return false;
              if (filter.operator === "after" && v <= filterV) return false;
              continue;
            }

            if (
              (filter.operator === "equals" || filter.operator === "not_equals") &&
              columnId === "genre"
            ) {
              const genres = value.split(",").map((x) => x.trim());

              if (filter.operator === "not_equals" && genres.every((x) => x === filter.value))
                return false;
              if (filter.operator === "equals" && genres.every((x) => x !== filter.value))
                return false;
            }

            if (columnId !== "genre" && filter.operator === "equals" && value !== filter.value)
              return false;
            if (columnId !== "genre" && filter.operator === "not_equals" && value === filter.value)
              return false;
            if (filter.operator === "less_than" && value >= filter.value!) return false;
            if (filter.operator === "greater_than" && value <= filter.value!) return false;
            if (
              filter.operator === "contains" &&
              !value.toLowerCase().includes(`${filter.value}`.toLowerCase())
            )
              return false;
          }

          return true;
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
