import { ChevronDownIcon } from "@1771technologies/lytenyte-pro/icons";
import { NumberInput } from "@ark-ui/react/number-input";
import { ChevronUpIcon } from "@radix-ui/react-icons";
import type { Grid } from "@1771technologies/lytenyte-pro-experimental";
import type { GridSpec } from "./demo";

function SkeletonLoading() {
  return (
    <div className="h-full w-full p-2">
      <div className="h-full w-full animate-pulse rounded-xl bg-gray-200 dark:bg-gray-100"></div>
    </div>
  );
}

const formatter = new Intl.NumberFormat("en-Us", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});
export function SalaryRenderer({ api, row, column }: Grid.T.CellRendererParams<GridSpec>) {
  const field = api.columnField(column, row);

  if (api.rowIsLeaf(row) && !row.data && row.loading) return <SkeletonLoading />;

  if (typeof field !== "number") return null;

  return <div className="flex h-full w-full items-center justify-end">${formatter.format(field)}</div>;
}

export function YearsOfExperienceRenderer({ api, row, column }: Grid.T.CellRendererParams<GridSpec>) {
  const field = api.columnField(column, row);

  if (api.rowIsLeaf(row) && !row.data && row.loading) return <SkeletonLoading />;

  if (typeof field !== "number") return null;

  return (
    <div className="flex w-full items-baseline justify-end gap-1 tabular-nums">
      <span className="font-bold">{field}</span>{" "}
      <span className="text-xs">{field <= 1 ? "Year" : "Years"}</span>
    </div>
  );
}

export function AgeCellRenderer({ api, row, column }: Grid.T.CellRendererParams<GridSpec>) {
  const field = api.columnField(column, row);

  if (api.rowIsLeaf(row) && !row.data && row.loading) return <SkeletonLoading />;

  if (typeof field !== "number") return null;

  return (
    <div className="flex w-full items-baseline justify-end gap-1 tabular-nums">
      <span className="font-bold">{formatter.format(field)}</span>{" "}
      <span className="text-xs">{field <= 1 ? "Year" : "Years"}</span>
    </div>
  );
}

export function BaseCellRenderer({ row, column, api }: Grid.T.CellRendererParams<GridSpec>) {
  if (api.rowIsLeaf(row) && !row.data && row.loading) return <SkeletonLoading />;

  const field = api.columnField(column, row);

  return <div className="flex h-full w-full items-center">{field as string}</div>;
}

export const NumberEditorInteger = ({ editValue, changeValue }: Grid.T.EditParams<GridSpec>) => {
  return (
    <NumberInput.Root
      className="border-ln-gray-30 flex h-full w-full items-center rounded border"
      value={`${editValue}`}
      onValueChange={(d) => {
        changeValue(Number.isNaN(d.valueAsNumber) ? 0 : d.valueAsNumber);
      }}
      min={0}
      max={100}
      allowOverflow={false}
    >
      <NumberInput.Input
        className="w-[calc(100%-16px)] flex-1 focus:outline-none"
        onKeyDown={(e) => {
          if (e.key === "." || e.key === "," || e.key === "-") {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
      />
      <NumberInput.Control className="flex w-4 flex-col">
        <NumberInput.IncrementTrigger>
          <ChevronUpIcon />
        </NumberInput.IncrementTrigger>
        <NumberInput.DecrementTrigger>
          <ChevronDownIcon />
        </NumberInput.DecrementTrigger>
      </NumberInput.Control>
    </NumberInput.Root>
  );
};

export const NumberEditor = ({ editValue, changeValue }: Grid.T.EditParams<GridSpec>) => {
  return (
    <NumberInput.Root
      className="border-ln-gray-30 flex h-full w-full items-center rounded border"
      value={`${editValue}`}
      onValueChange={(d) => {
        changeValue(Number.isNaN(d.valueAsNumber) ? 0 : d.valueAsNumber);
      }}
      onKeyDown={(e) => {
        if (e.key === "," || e.key === "-") {
          e.preventDefault();
          e.stopPropagation();
        }
      }}
      min={0}
      allowOverflow={false}
    >
      <NumberInput.Input className="w-[calc(100%-16px)] flex-1 focus:outline-none" />
      <NumberInput.Control className="flex w-4 flex-col">
        <NumberInput.IncrementTrigger>
          <ChevronUpIcon />
        </NumberInput.IncrementTrigger>
        <NumberInput.DecrementTrigger>
          <ChevronDownIcon />
        </NumberInput.DecrementTrigger>
      </NumberInput.Control>
    </NumberInput.Root>
  );
};

export const TextEditor = ({ editValue, changeValue }: Grid.T.EditParams<GridSpec>) => {
  return (
    <input
      className="border-ln-gray-30 h-full w-full rounded border"
      value={`${editValue}`}
      onChange={(e) => changeValue(e.target.value)}
    />
  );
};
