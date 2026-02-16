import type { Grid, DataRequest, DataResponse } from "@1771technologies/lytenyte-pro-experimental";
import { data } from "./data.js";
import type { GridSpec } from "./demo.jsx";

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

const columns: Grid.Column<GridSpec>[] = [
  { id: "#", name: "", width: 30, field: "link", widthMin: 30, widthMax: 30 },
  { id: "name", name: "Title", width: 250, widthFlex: 1 },
  { id: "released_at", name: "Released", width: 120 },
  { id: "genre", name: "Genre" },
  { id: "type", name: "Type", width: 120 },
  { id: "imdb_rating", name: "Rating", width: 120 },
];
