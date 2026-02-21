import { useTheme } from "@1771technologies/play-frame";
import "@1771technologies/lytenyte-design/fonts.css";
import "../../css/grid-full.css";

import { useRef, useState } from "react";
import { RowGroupCell } from "../components/row-group-cell.js";
import type { SalaryData } from "./basic-server-data/data";
import { useServerDataSource } from "../data-source-server/use-server-data-source.js";
import { Server } from "./basic-server-data/page-server.js";
import { Grid } from "../index.js";
import type { MovieData } from "./basic-server-data/page-data";

export interface GridSpec {
  readonly data: MovieData;
}

const columns: Grid.Column<GridSpec>[] = [
  {
    id: "#",
    name: "",
    width: 30,
    field: "link",
    widthMin: 30,
    widthMax: 30,
  },
  { id: "name", name: "Title", width: 250, widthFlex: 1 },
  { id: "released_at", name: "Released", width: 120 },
  { id: "genre", name: "Genre" },
  { id: "type", name: "Type", width: 120 },
  { id: "imdb_rating", name: "Rating", width: 120 },
];

export default function Experimental() {
  const [page, setPage] = useState(0);
  const [pageCount, setPageCount] = useState<null | number>(null);

  const [pageSize, setPageSize] = useState(20);

  const ds = useServerDataSource<SalaryData, [page: number, pageSize: number]>({
    rowGroupDefaultExpansion: true,
    queryFn: async ({ requests, queryKey }) => {
      const page = queryKey[0];
      const pageSize = queryKey[1];

      const result = await Server(requests, page, pageSize);

      setPageCount(pageCount);
      return result.pages;
    },
    queryKey: [page, pageSize],
  });

  const [rowGroupColumn, setRowGroupColumn] = useState<Grid.Props<GridSpec>["rowGroupColumn"]>({
    cellRenderer: RowGroupCell,
  });

  const isLoading = ds.isLoading.useValue();
  const error = ds.loadingError.useValue();

  const { resolvedTheme } = useTheme();

  const ref = useRef<Grid.API<GridSpec>>(null);
  return (
    <>
      <div style={{ height: 40 }}>
        <>
          {isLoading && <div>Loading...</div>}
          {error && <div>{`${error}`}</div>}
        </>
      </div>
      <div>
        <button onClick={() => setPageSize((prev) => prev + 10)}>Page </button>
      </div>
      <div>
        <button onClick={() => setPage((next) => next + 1)}>Next</button>
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div
          className={"ln-grid " + (resolvedTheme === "light" ? "ln-light" : "ln-dark")}
          style={{ height: "50vh", width: "90vw" }}
        >
          <Grid
            columns={columns}
            rowSource={ds}
            rowHeight="fill:30"
            rowGroupColumn={rowGroupColumn}
            onRowGroupColumnChange={setRowGroupColumn}
            virtualizeRows={false}
            ref={ref}
          />
        </div>
      </div>
    </>
  );
}
