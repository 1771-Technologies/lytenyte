import type { DataRequest, DataResponse } from "@1771technologies/lytenyte-pro";
import type { MovieData } from "./data";
import { data as movieData } from "./data.js";
import type { GridFilter } from "./types.js";

const sleep = () => new Promise((res) => setTimeout(res, 200));

export async function Server(reqs: DataRequest[], filterModel: Record<string, GridFilter>) {
  // Simulate latency and server work.
  await sleep();

  const filters = Object.entries(filterModel);

  const data =
    filters.length === 0
      ? movieData
      : movieData.filter((row) => {
          for (const [columnId, filter] of filters) {
            const value = row[columnId as keyof MovieData];
            if (!value) return false;

            if (columnId === "imdb_rating") {
              if (filter.kind !== "number") return;

              const rating = value ? Math.round(Number.parseFloat(value.split("/")[0]) / 2) : "";
              const checkValue = rating as number;

              if (filter.operator === "equals") return checkValue === filter.value;
              if (filter.operator === "not_equals") return checkValue !== filter.value;
              if (filter.operator === "greater_than") return checkValue > filter.value;
              if (filter.operator === "greater_than_or_equal") return checkValue >= filter.value;
              if (filter.operator === "less_than") return checkValue < filter.value;
              if (filter.operator === "less_than_or_equal") return checkValue <= filter.value;

              return false;
            }

            if (columnId === "released_at") {
              const v = new Date(value);
              const filterV = new Date(filter.value as string);

              if (filter.operator === "before" && v >= filterV) return false;
              if (filter.operator === "after" && v <= filterV) return false;
              continue;
            }

            if (columnId === "genre" && filter.operator === "equals") {
              const genres = value
                .toLowerCase()
                .split(",")
                .map((x) => x.trim());
              return genres.some((x) => x === String(filter.value).toLowerCase());
            }
            if (columnId === "genre" && filter.operator === "not_equals") {
              const genres = value
                .toLowerCase()
                .split(",")
                .map((x) => x.trim());
              return genres.every((x) => x !== String(filter.value).toLowerCase());
            }

            if (filter.operator === "equals") return `${filter.value}`.toLowerCase() === value.toLowerCase();
            if (filter.operator === "not_equals")
              return `${filter.value}`.toLowerCase() !== value.toLowerCase();

            if (filter.operator === "contains")
              return value.toLowerCase().includes(`${filter.value}`.toLowerCase());
            if (filter.operator === "not_contains") {
              return !value.toLowerCase().includes(`${filter.value}`.toLowerCase());
            }
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
