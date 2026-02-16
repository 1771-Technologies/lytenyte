import { format } from "date-fns";
import type { JSX } from "react";
import { Rating, ThinRoundedStar } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";
import { ArrowDownIcon, ArrowUpIcon, Link1Icon } from "@radix-ui/react-icons";
import type { Grid } from "@1771technologies/lytenyte-pro-experimental";
import type { GridSpec } from "./demo";

function SkeletonLoading() {
  return (
    <div className="h-full w-full p-2">
      <div className="bg-ln-gray-20 h-full w-full animate-pulse rounded-xl"></div>
    </div>
  );
}

export const NameCellRenderer = (params: Grid.T.CellRendererParams<GridSpec>) => {
  if (params.row.loading && !params.row.data) return <SkeletonLoading />;

  const field = params.api.columnField(params.column, params.row) as string;

  return <div className="overflow-hidden text-ellipsis">{field}</div>;
};

export const ReleasedRenderer = (params: Grid.T.CellRendererParams<GridSpec>) => {
  if (params.row.loading && !params.row.data) return <SkeletonLoading />;
  const field = params.api.columnField(params.column, params.row) as string;

  const formatted = field ? format(field, "dd MMM yyyy") : "-";

  return <div>{formatted}</div>;
};

export const GenreRenderer = (params: Grid.T.CellRendererParams<GridSpec>) => {
  if (params.row.loading && !params.row.data) return <SkeletonLoading />;
  const field = params.api.columnField(params.column, params.row) as string;

  const splits = field ? field.split(",") : [];

  return (
    <div className="flex h-full w-full items-center gap-1">
      {splits.map((c) => {
        return (
          <div
            className="border-(--primary-200) text-(--primary-700) dark:text-(--primary-500) bg-(--primary-200)/20 rounded border p-1 px-2 text-xs"
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

export const TypeRenderer = (params: Grid.T.CellRendererParams<GridSpec>) => {
  if (params.row.loading && !params.row.data) return <SkeletonLoading />;
  const field = params.api.columnField(params.column, params.row) as string;

  const isMovie = field === "Movie";
  const Icon = isMovie ? FilmRealIcon : MonitorPlayIcon;

  return (
    <div className="flex h-full w-full items-center gap-2">
      <span className={isMovie ? "text-(--primary-500)" : "text-ln-primary-50"}>
        <Icon />
      </span>
      <span>{field}</span>
    </div>
  );
};

export const RatingRenderer = (params: Grid.T.CellRendererParams<GridSpec>) => {
  if (params.row.loading && !params.row.data) return <SkeletonLoading />;
  const field = params.api.columnField(params.column, params.row) as string;
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

export const LinkRenderer = (params: Grid.T.CellRendererParams<GridSpec>) => {
  if (params.row.loading && !params.row.data) return <SkeletonLoading />;
  const field = params.api.columnField(params.column, params.row) as string;

  return (
    <a href={field} className="text-(--primary-500)">
      <Link1Icon />
    </a>
  );
};

export function Header({ api, column }: Grid.T.HeaderParams<GridSpec>) {
  return (
    <div
      className="group relative flex h-full w-full cursor-pointer items-center px-1 text-sm transition-colors"
      onClick={() => {
        const nextSort = column.sort === "asc" ? null : column.sort === "desc" ? "asc" : "desc";
        api.sortColumn(column.id, nextSort);
      }}
    >
      <div className="sort-button flex w-full items-center justify-between rounded px-1 py-1 transition-colors">
        {column.name ?? column.id}

        {column.sort === "asc" && <ArrowUpIcon className="text-ln-text-dark size-4" />}
        {column.sort === "desc" && <ArrowDownIcon className="text-ln-text-dark size-4" />}
      </div>
    </div>
  );
}
