import type { DataRequest, DataResponse } from "@1771technologies/lytenyte-pro";
import { data as movieData, type MovieData } from "./data.js";
import type { GridFilter } from "./types.js";

const sleep = () => new Promise((res) => setTimeout(res, 200));

export async function Server(
  reqs: DataRequest[],
  page: number,
  pageSize: number,
  filterModel: Record<string, GridFilter>,
) {
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
              if (filter.kind !== "number") continue;

              const rating = value ? Math.round(Number.parseFloat(value.split("/")[0]) / 2) : "";
              const checkValue = rating as number;

              if (filter.operator === "equals" && checkValue !== filter.value) return false;
              if (filter.operator === "not_equals" && checkValue === filter.value) return false;
              if (filter.operator === "greater_than" && checkValue <= filter.value) return false;
              if (filter.operator === "greater_than_or_equal" && checkValue < filter.value) return false;
              if (filter.operator === "less_than" && checkValue >= filter.value) return false;
              if (filter.operator === "less_than_or_equal" && checkValue > filter.value) return false;

              continue;
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

              if (genres.some((x) => x === String(filter.value).toLowerCase())) continue;
              return false;
            }
            if (columnId === "genre" && filter.operator === "not_equals") {
              const genres = value
                .toLowerCase()
                .split(",")
                .map((x) => x.trim());

              if (genres.every((x) => x !== String(filter.value).toLowerCase())) continue;
              return false;
            }

            if (filter.operator === "equals" && `${filter.value}`.toLowerCase() !== value.toLowerCase())
              return false;
            if (filter.operator === "not_equals" && `${filter.value}`.toLowerCase() === value.toLowerCase())
              return false;

            if (
              filter.operator === "contains" &&
              !value.toLowerCase().includes(`${filter.value}`.toLowerCase())
            )
              return false;
            if (
              filter.operator === "not_contains" &&
              value.toLowerCase().includes(`${filter.value}`.toLowerCase())
            ) {
              return false;
            }
          }

          return true;
        });

  let pageStart = page * pageSize;

  if (pageStart > data.length) {
    pageStart = data.length - pageSize;
  }

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
