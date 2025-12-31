import type {
  Column,
  DataRequest,
  DataResponse,
  FilterIn,
  FilterInFilterItem,
} from "@1771technologies/lytenyte-pro/types";

import type { MovieData } from "./data";
import { data as movieData } from "./data";

const sleep = () => new Promise((res) => setTimeout(res, 600));

export async function Server(reqs: DataRequest[], filterModel: Record<string, FilterIn>) {
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

            const filterSet = new Set([...filter.value].map((x) => `${x}`.toLowerCase()));

            if (columnId === "genre") {
              const parts = value
                .split(",")
                .map((c) => c.trim().toLowerCase())
                .filter(Boolean);

              if (filter.operator === "not_in" && parts.some((x) => filterSet.has(x))) return false;
              if (filter.operator === "in" && !parts.some((x) => filterSet.has(x))) return false;
            } else {
              if (filter.operator === "not_in" && filterSet.has(`${value}`.toLowerCase()))
                return false;
              if (filter.operator === "in" && !filterSet.has(`${value}`.toLowerCase()))
                return false;
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

export async function ServerInFilter(column: Column<MovieData>): Promise<FilterInFilterItem[]> {
  // Simulate latency and server work.
  await sleep();

  const values = movieData
    .flatMap((c) => {
      if (column.id === "genre") return c[column.id].split(",");

      return c[column.id as keyof MovieData];
    })
    .map((x) => x.trim())
    .filter(Boolean);

  return [...new Set(values)].sort().map((x) => {
    return {
      id: x,
      label: x,
      value: x,
    } satisfies FilterInFilterItem;
  });
}
