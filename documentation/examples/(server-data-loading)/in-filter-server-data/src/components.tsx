import type {
  CellRendererFn,
  HeaderCellRendererFn,
  HeaderCellRendererParams,
} from "@1771technologies/lytenyte-pro/types";
import type { MovieData } from "./data";
import { format } from "date-fns";
import { useState, type JSX } from "react";
import { Rating, ThinRoundedStar } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";
import { Link1Icon } from "@radix-ui/react-icons";
import {
  Checkbox,
  GridInput,
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
  tw,
} from "./ui";
import { FunnelIcon } from "lucide-react";

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

export const LinkRenderer: CellRendererFn<MovieData> = (params) => {
  if (params.row.loading) return <SkeletonLoading />;

  const field = params.grid.api.columnField(params.column, params.row) as string;

  return (
    <a href={field}>
      <Link1Icon />
    </a>
  );
};

export const HeaderRenderer: HeaderCellRendererFn<MovieData> = ({ grid, column }) => {
  const model = grid.state.filterInModel.useValue();
  const filter = model[column.id];
  const [open, setOpen] = useState(false);
  if (column.id === "#") return null;

  return (
    <div className="flex h-full w-full items-center justify-between text-sm capitalize">
      <span>{column.name ?? column.id}</span>
      <span className="flex items-center justify-center">
        <Popover modal open={open} onOpenChange={setOpen}>
          <PopoverTrigger
            className={tw(
              "h-[20px] w-[20px] cursor-pointer",
              filter ? "relative opacity-100" : "opacity-70",
            )}
          >
            {filter && (
              <div className="bg-ln-primary-50 absolute right-0 top-0 h-2 w-2 rounded-full" />
            )}
            <FunnelIcon className="size-3" width={16} height={16} />
          </PopoverTrigger>
          <PopoverContent className="px-0">
            <InFilterPopoverContent grid={grid} column={column} />
          </PopoverContent>
        </Popover>
      </span>
    </div>
  );
};

import { FilterTree as T } from "@1771technologies/lytenyte-pro";
import { SearchIcon } from "@1771technologies/lytenyte-pro/icons";
type TreeItem = ReturnType<typeof T.useFilterTree>["tree"][number];

export function InFilterPopoverContent({ column, grid }: HeaderCellRendererParams<MovieData>) {
  const [query, setQuery] = useState("");
  const inFilter = T.useFilterTree({
    grid,
    column,
    treeItemHeight: 30,
    query: query,
  });

  return (
    <>
      <div className="px-2">
        <div className="bg-ln-gray-02 border-ln-gray-20 z-50 w-full rounded-lg border">
          <div className="relative">
            <GridInput
              className="bg-ln-gray-02 border-b-ln-gray-20 focus-visible::outline-none w-full rounded-b-none border-b px-7 text-xs shadow-none outline-none focus-visible:shadow-none"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
            />
            <SearchIcon className="text-ln-gray-70 absolute left-1.5 top-[6px] size-4" />
          </div>
          <T.Root
            {...inFilter.rootProps}
            loadingAs={() => {
              return (
                <div className="flex items-center justify-center px-2 py-2">Loading items...</div>
              );
            }}
          >
            <T.Panel
              className=""
              style={{
                height: 250,
                overflowY: "auto",
                overflowX: "hidden",
                position: "relative",
              }}
            >
              {inFilter.tree.map((c) => {
                return (
                  <RenderNode item={c} key={c.kind === "branch" ? c.branch.id : c.leaf.data.id} />
                );
              })}
            </T.Panel>

            <div className="flex justify-end gap-2 py-2">
              <PopoverClose
                onClick={() => {
                  inFilter.reset();

                  grid.state.filterInModel.set((prev) => {
                    const next = { ...prev };
                    delete next[column.id];

                    return next;
                  });

                  grid.state.filterModel.set((prev) => {
                    const next = { ...prev };
                    delete next[column.id];

                    return next;
                  });
                }}
                className={tw(
                  "border-ln-gray-30 hover:bg-ln-gray-10 bg-ln-gray-00 text-ln-gray-70 rounded border px-3 py-0.5 text-sm",
                )}
              >
                Clear
              </PopoverClose>
              <PopoverClose
                onClick={() => {
                  inFilter.apply();
                }}
                style={{ transform: "scale(0.92)" }}
                className={tw(
                  "border-ln-primary-30 hover:bg-ln-primary-70 bg-ln-primary-50 text-ln-gray-02 rounded border px-3 py-0.5 text-sm font-semibold",
                )}
              >
                Apply
              </PopoverClose>
            </div>
          </T.Root>
        </div>
      </div>
    </>
  );
}
function RenderNode({ item }: { item: TreeItem }) {
  if (item.kind === "leaf") {
    return (
      <T.Leaf
        item={item}
        className="hover:bg-ln-gray-20 text-ln-gray-80 focus-visible:bg-ln-primary-30 flex cursor-pointer items-center gap-2 rounded-lg px-2 text-xs"
      >
        <T.Checkbox
          as={
            (({ checked, toggle }: any) => {
              return <Checkbox checked={checked} onToggle={() => toggle} />;
            }) as any
          }
        />
        <T.Label className="overflow-hidden text-ellipsis text-nowrap" />
      </T.Leaf>
    );
  }

  const values = [...item.children.values()];

  return (
    <T.Branch
      item={item}
      label={
        <div style={{ display: "flex", gap: "2px" }}>
          <T.Checkbox />
          <T.Label />
        </div>
      }
    >
      {values.map((c) => {
        return <RenderNode item={c} key={c.kind === "branch" ? c.branch.id : c.leaf.data.id} />;
      })}
    </T.Branch>
  );
}
