import type { Grid } from "@1771technologies/lytenyte-pro";
import type { GridSpec } from "./demo";
import { format, isValid, parse } from "date-fns";
import { countryFlags } from "@1771technologies/grid-sample-data/sales-data";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ArrowDownIcon, ArrowUpIcon } from "@radix-ui/react-icons";

export function Header({ api, column }: Grid.T.HeaderParams<GridSpec>) {
  const sorts = api.sorts.useValue();
  const sort = sorts?.id === column.id;
  const dir = sorts?.dir;

  return (
    <div
      className="group relative flex h-full w-full cursor-pointer items-center text-sm transition-colors"
      onClick={() => {
        const nextSort = dir === "desc" ? "asc" : dir === "asc" ? null : "desc";
        if (nextSort === null) api.sorts.set(null);
        else api.sorts.set({ id: column.id, dir: nextSort });
      }}
    >
      <div
        className={tw(
          "sort-button flex w-full items-center gap-2 rounded py-1 transition-colors",
          column.type === "number" && "flex-row-reverse",
        )}
      >
        {column.name ?? column.id}

        {sort && dir === "asc" && <ArrowUpIcon className="text-ln-text-dark size-4" />}
        {sort && dir === "desc" && <ArrowDownIcon className="text-ln-text-dark size-4" />}
      </div>
    </div>
  );
}

export function DateCell({ api, row, column }: Grid.T.CellRendererParams<GridSpec>) {
  const field = api.columnField(column, row);

  if (typeof field !== "string") return "-";

  const dateField = parse(field as string, "MM/dd/yyyy", new Date());

  if (!isValid(dateField)) return "-";

  const niceDate = format(dateField, "yyyy MMM dd");
  return <div className="flex h-full w-full items-center tabular-nums">{niceDate}</div>;
}

export function AgeGroupPivotHeader({ column }: Grid.T.HeaderParams<GridSpec>) {
  const field = column.name ?? column.id;

  if (field === "Under 25") return <div className="text-[#944cec] dark:text-[#B181EB]">Under 25</div>;
  if (field === "25-34") return <div className="text-[#aa6c1a] dark:text-[#E5B474]">25-34</div>;
  if (field === "35-64") return <div className="text-[#0f7d4c] dark:text-[#52B086]">35-64</div>;

  if (field === "Grand Total") return "Grand Total";

  return "Other";
}

export function AgeGroup({ api, row, column }: Grid.T.CellRendererParams<GridSpec>) {
  const field = api.columnField(column, row);

  if (field === "Under 25") return <div className="text-[#944cec] dark:text-[#B181EB]">Under 25</div>;
  if (field === "25-34") return <div className="text-[#aa6c1a] dark:text-[#E5B474]">25-34</div>;
  if (field === "35-64") return <div className="text-[#0f7d4c] dark:text-[#52B086]">35-64</div>;

  return "-";
}

export function GenderCell({ api, row, column }: Grid.T.CellRendererParams<GridSpec>) {
  const field = api.columnField(column, row);

  if (field === "Male")
    return (
      <div className="flex h-full w-full items-center gap-2">
        <div className="flex size-6 items-center justify-center rounded-full bg-blue-500/50">
          <svg width="16" height="16" fill="currentcolor" viewBox="0 0 256 256">
            <path d="M216,28H168a12,12,0,0,0,0,24h19L154.28,84.74a84,84,0,1,0,17,17L204,69V88a12,12,0,0,0,24,0V40A12,12,0,0,0,216,28ZM146.41,194.46a60,60,0,1,1,0-84.87A60.1,60.1,0,0,1,146.41,194.46Z"></path>
          </svg>
        </div>
        Male
      </div>
    );

  if (field === "Female")
    return (
      <div className="flex h-full w-full items-center gap-2">
        <div className="flex size-6 items-center justify-center rounded-full bg-pink-500/50">
          <svg width="16" height="16" fill="currentcolor" viewBox="0 0 256 256">
            <path d="M212,96a84,84,0,1,0-96,83.13V196H88a12,12,0,0,0,0,24h28v20a12,12,0,0,0,24,0V220h28a12,12,0,0,0,0-24H140V179.13A84.12,84.12,0,0,0,212,96ZM68,96a60,60,0,1,1,60,60A60.07,60.07,0,0,1,68,96Z"></path>
          </svg>
        </div>
        Female
      </div>
    );

  return "-";
}

function tw(...c: ClassValue[]) {
  return twMerge(clsx(...c));
}

const formatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
  minimumFractionDigits: 0,
});
export function ProfitCell({ api, row, column }: Grid.T.CellRendererParams<GridSpec>) {
  const field = api.columnField(column, row);

  if (typeof field !== "number") return "-";

  const formatted = field < 0 ? `-$${formatter.format(Math.abs(field))}` : "$" + formatter.format(field);

  return (
    <div
      className={tw(
        "flex h-full w-full items-center justify-end tabular-nums",
        field < 0 && "text-red-600 dark:text-red-300",
        field > 0 && "text-green-600 dark:text-green-300",
      )}
    >
      {formatted}
    </div>
  );
}

export function NumberCell({ api, row, column }: Grid.T.CellRendererParams<GridSpec>) {
  const field = api.columnField(column, row);

  if (typeof field !== "number") return "-";

  const formatted = field < 0 ? `-$${formatter.format(Math.abs(field))}` : "$" + formatter.format(field);

  return <div className={"flex h-full w-full items-center justify-end tabular-nums"}>{formatted}</div>;
}

export function CostCell({ api, row, column }: Grid.T.CellRendererParams<GridSpec>) {
  const field = api.columnField(column, row);

  if (typeof field !== "number") return "-";

  const formatted = field < 0 ? `-$${formatter.format(Math.abs(field))}` : "$" + formatter.format(field);

  return (
    <div
      className={tw(
        "flex h-full w-full items-center justify-end tabular-nums text-red-600 dark:text-red-300",
      )}
    >
      {formatted}
    </div>
  );
}

export function CountryCell({ api, row, column }: Grid.T.CellRendererParams<GridSpec>) {
  const field = api.columnField(column, row);

  const flag = countryFlags[field as keyof typeof countryFlags];
  if (!flag) return "-";

  return (
    <div className="flex h-full w-full items-center gap-2">
      <img className="size-4" src={flag} alt={`country flag of ${field}`} />
      <span>{String(field ?? "-")}</span>
    </div>
  );
}
