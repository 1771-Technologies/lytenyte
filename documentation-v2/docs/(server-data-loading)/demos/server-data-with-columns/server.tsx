import type { Column, DataRequest, DataResponse } from "@1771technologies/lytenyte-pro/types";

import type { MovieData } from "./data";
import { data } from "./data";

const sleep = () => new Promise((res) => setTimeout(res, 600));

export async function Server(reqs: DataRequest[]) {
  // Simulate latency and server work.
  await sleep();

  return {
    columns,
    data: reqs.map((c) => {
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
  };
}

const columns: Column<MovieData>[] = [
  {
    id: "#",
    name: "",
    width: 30,
    field: "link",
    widthMin: 30,
    widthMax: 30,
    cellRenderer: "link",
  },
  { id: "name", name: "Title", width: 250, widthFlex: 1, cellRenderer: "name" },
  { id: "released_at", name: "Released", width: 120, cellRenderer: "release" },
  { id: "genre", name: "Genre", cellRenderer: "genre" },
  { id: "type", name: "Type", width: 120, cellRenderer: "type" },
  { id: "imdb_rating", name: "Rating", width: 120, cellRenderer: "rating" },
];
