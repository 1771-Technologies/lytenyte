import type { Grid } from "@1771technologies/lytenyte-pro-experimental";
import type { GridSpec } from "./demo";
import { format, isValid, parse } from "date-fns";
import { countryFlags } from "@1771technologies/grid-sample-data/sales-data";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";

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

  if (field === "M")
    return (
      <div className="flex h-full w-full items-center gap-2">
        <div className="flex size-6 items-center justify-center rounded-full bg-blue-500/50">
          <span className="iconify ph--gender-male-bold size-4" />
        </div>
        M
      </div>
    );

  if (field === "F")
    return (
      <div className="flex h-full w-full items-center gap-2">
        <div className="flex size-6 items-center justify-center rounded-full bg-pink-500/50">
          <span className="iconify ph--gender-female-bold size-4" />
        </div>
        F
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

export function HeaderGroupCell({
  groupPath,
  api,
  collapsible,
  collapsed,
}: Grid.T.HeaderGroupParams<GridSpec>) {
  return (
    <>
      <div className="flex-1">{groupPath.at(-1)!}</div>
      <button
        data-ln-button="secondary"
        data-ln-icon
        data-ln-size="sm"
        onClick={() => api.columnToggleGroup(groupPath)}
      >
        {collapsible && collapsed && <ChevronRightIcon />}
        {collapsible && !collapsed && <ChevronLeftIcon />}
      </button>
    </>
  );
}
