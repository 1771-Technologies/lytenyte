import type {
  CellRendererFn,
  HeaderCellRendererParams,
  SortModelItem,
} from "@1771technologies/lytenyte-pro/types";
import type { MovieData } from "./data";
import { format } from "date-fns";
import { useContext, type JSX } from "react";
import { Rating, ThinRoundedStar } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";
import { ArrowDownIcon, ArrowUpIcon } from "@radix-ui/react-icons";
import { context } from "./nulls-first-context";

function SkeletonLoading() {
  return (
    <div className="h-full w-full p-2">
      <div className="h-full w-full animate-pulse rounded-xl bg-gray-200 dark:bg-gray-100"></div>
    </div>
  );
}

export const NameCellRenderer: CellRendererFn<MovieData> = (params) => {
  if (params.row.loading) return <SkeletonLoading />;

  const field = params.grid.api.columnField(params.column, params.row) as string;

  return <div className="overflow-hidden text-ellipsis">{field}</div>;
};

export const ReleasedRenderer: CellRendererFn<MovieData> = (params) => {
  if (params.row.loading) return <SkeletonLoading />;

  const field = params.grid.api.columnField(params.column, params.row) as string;

  const formatted = field ? format(field, "dd MMM yyyy") : "-";

  return <div>{formatted}</div>;
};

export const GenreRenderer: CellRendererFn<MovieData> = (params) => {
  if (params.row.loading) return <SkeletonLoading />;

  const field = params.grid.api.columnField(params.column, params.row) as string;

  const splits = field ? field.split(",") : [];

  return (
    <div className="flex h-full w-full items-center gap-1">
      {splits.map((c) => {
        return (
          <div
            className="border-primary-200 text-primary-700 dark:text-primary-500 bg-primary-200/20 rounded border p-1 px-2 text-xs"
            key={c}
          >
            {c}
          </div>
        );
      })}
    </div>
  );
};

const FilmRealIcon = (props: JSX.IntrinsicElements["svg"]) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      fill="currentcolor"
      viewBox="0 0 256 256"
      {...props}
    >
      <path d="M232,216H183.36A103.95,103.95,0,1,0,128,232H232a8,8,0,0,0,0-16ZM40,128a88,88,0,1,1,88,88A88.1,88.1,0,0,1,40,128Zm88-24a24,24,0,1,0-24-24A24,24,0,0,0,128,104Zm0-32a8,8,0,1,1-8,8A8,8,0,0,1,128,72Zm24,104a24,24,0,1,0-24,24A24,24,0,0,0,152,176Zm-32,0a8,8,0,1,1,8,8A8,8,0,0,1,120,176Zm56-24a24,24,0,1,0-24-24A24,24,0,0,0,176,152Zm0-32a8,8,0,1,1-8,8A8,8,0,0,1,176,120ZM80,104a24,24,0,1,0,24,24A24,24,0,0,0,80,104Zm0,32a8,8,0,1,1,8-8A8,8,0,0,1,80,136Z"></path>
    </svg>
  );
};

const MonitorPlayIcon = (props: JSX.IntrinsicElements["svg"]) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      fill="currentcolor"
      viewBox="0 0 256 256"
      {...props}
    >
      <path d="M208,40H48A24,24,0,0,0,24,64V176a24,24,0,0,0,24,24H208a24,24,0,0,0,24-24V64A24,24,0,0,0,208,40Zm8,136a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V64a8,8,0,0,1,8-8H208a8,8,0,0,1,8,8Zm-48,48a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,224Zm-3.56-110.66-48-32A8,8,0,0,0,104,88v64a8,8,0,0,0,12.44,6.66l48-32a8,8,0,0,0,0-13.32ZM120,137.05V103l25.58,17Z"></path>
    </svg>
  );
};

export const TypeRenderer: CellRendererFn<MovieData> = (params) => {
  if (params.row.loading) return <SkeletonLoading />;

  const field = params.grid.api.columnField(params.column, params.row) as string;

  const isMovie = field === "Movie";
  const Icon = isMovie ? FilmRealIcon : MonitorPlayIcon;

  return (
    <div className="flex h-full w-full items-center gap-2">
      <span className={isMovie ? "text-primary-500" : "text-accent-500"}>
        <Icon />
      </span>
      <span>{field}</span>
    </div>
  );
};

export const RatingRenderer: CellRendererFn<MovieData> = (params) => {
  if (params.row.loading) return <SkeletonLoading />;

  const field = params.grid.api.columnField(params.column, params.row) as string;
  const rating = field ? Number.parseFloat(field.split("/")[0]) : null;
  if (rating == null || Number.isNaN(rating)) return "-";

  return (
    <div className="flex h-full w-full items-center">
      <Rating
        style={{ maxWidth: 100 }}
        halfFillMode="svg"
        value={Math.round(rating / 2)}
        itemStyles={{
          activeFillColor: "hsla(173, 78%, 34%, 1)",
          itemShapes: ThinRoundedStar,
          inactiveFillColor: "transparent",
          inactiveBoxBorderColor: "transparent",
          inactiveBoxColor: "transparent",
          inactiveStrokeColor: "transparent",
        }}
        readOnly
      />
    </div>
  );
};

export function HeaderRenderer({ column, grid }: HeaderCellRendererParams<MovieData>) {
  const sort = grid.state.sortModel.useValue().find((c) => c.columnId === column.id);
  const nullsFirstOption = useContext(context);

  const isDescending = sort?.isDescending ?? false;

  return (
    <div
      className="hover:bg-ln-gray-10 flex h-full w-full items-center px-2 text-sm transition-all"
      onClick={() => {
        const current = grid.api.sortForColumn(column.id);

        if (current == null) {
          let sort: SortModelItem<MovieData>;
          const columnId = column.id;

          if (column.type === "datetime") {
            sort = {
              columnId,
              sort: { kind: "date", options: { includeTime: true, nullsFirst: nullsFirstOption } },
            };
          } else if (column.type === "number") {
            sort = {
              columnId,
              sort: { kind: "number", options: { nullsFirst: nullsFirstOption } },
            };
          } else {
            sort = {
              columnId,
              sort: { kind: "string", options: { nullsFirst: nullsFirstOption } },
            };
          }

          grid.state.sortModel.set([sort]);
          return;
        }
        if (!current.sort.isDescending) {
          grid.state.sortModel.set([{ ...current.sort, isDescending: true }]);
        } else {
          grid.state.sortModel.set([]);
        }
      }}
    >
      {column.name ?? column.id}

      {sort && (
        <>
          {!isDescending ? (
            <ArrowUpIcon className="size-4" />
          ) : (
            <ArrowDownIcon className="size-4" />
          )}
        </>
      )}
    </div>
  );
}
