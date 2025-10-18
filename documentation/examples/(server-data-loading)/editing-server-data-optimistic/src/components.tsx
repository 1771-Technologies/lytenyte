import type { CellRendererParams, EditRenderer } from "@1771technologies/lytenyte-pro/types";
import type { SalaryData } from "./data";
import type { CSSProperties } from "react";
import { ChevronDownIcon, ChevronRightIcon } from "@1771technologies/lytenyte-pro/icons";
import { twMerge } from "tailwind-merge";
import type { ClassValue } from "clsx";
import clsx from "clsx";

function tw(...c: ClassValue[]) {
  return twMerge(clsx(...c));
}

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
export function SalaryRenderer({ grid, row, column }: CellRendererParams<SalaryData>) {
  const field = grid.api.columnField(column, row);

  if (grid.api.rowIsLeaf(row) && row.loading) return <SkeletonLoading />;

  if (typeof field !== "number") return null;

  return (
    <div className="flex h-full w-full items-center justify-end">${formatter.format(field)}</div>
  );
}

export function YearsOfExperienceRenderer({ grid, row, column }: CellRendererParams<SalaryData>) {
  const field = grid.api.columnField(column, row);

  if (grid.api.rowIsLeaf(row) && row.loading) return <SkeletonLoading />;

  if (typeof field !== "number") return null;

  return (
    <div className="flex w-full items-baseline justify-end gap-1 tabular-nums">
      <span className="font-bold">{field}</span>{" "}
      <span className="text-xs">{field <= 1 ? "Year" : "Years"}</span>
    </div>
  );
}

export function BaseCellRenderer({ row, column, grid }: CellRendererParams<any>) {
  if (grid.api.rowIsLeaf(row) && row.loading) return <SkeletonLoading />;

  const field = grid.api.columnField(column, row);

  return <div className="flex h-full w-full items-center">{field as string}</div>;
}

export function AgeCellRenderer({ grid, row, column }: CellRendererParams<SalaryData>) {
  const field = grid.api.columnField(column, row);

  if (grid.api.rowIsLeaf(row) && row.loading) return <SkeletonLoading />;

  if (typeof field !== "number") return null;

  return (
    <div className="flex w-full items-baseline justify-end gap-1 tabular-nums">
      <span className="font-bold">{formatter.format(field)}</span>{" "}
      <span className="text-xs">{field <= 1 ? "Year" : "Years"}</span>
    </div>
  );
}

export function GroupCellRenderer({ row, grid }: CellRendererParams<any>) {
  if (grid.api.rowIsLeaf(row) && row.loading) return <SkeletonLoading />;

  if (grid.api.rowIsLeaf(row)) return <div />;

  const isExpanded = grid.api.rowGroupIsExpanded(row);

  return (
    <div
      style={
        {
          paddingLeft: row.depth * 16,
          "--before-offset": `${row.depth * 16 - 5}px`,
        } as CSSProperties
      }
      className={tw(
        "relative flex h-full w-full items-center gap-2 overflow-hidden text-nowrap",
        row.depth > 0 &&
          "before:border-ln-gray-30 before:absolute before:left-[var(--before-offset)] before:top-0 before:h-full before:border-r before:border-dashed",
      )}
    >
      {row.loadingGroup && (
        <div className="w-5">
          <LoadingSpinner />
        </div>
      )}
      {!row.loadingGroup && (
        <button
          className="hover:bg-ln-gray-10 w-5 cursor-pointer rounded transition-colors"
          onClick={() => {
            grid.api.rowGroupToggle(row);
          }}
        >
          <span className="sr-only">Toggle the row group</span>
          {isExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
        </button>
      )}
      <div className="w-full overflow-hidden text-ellipsis">{row.key || "(none)"}</div>
    </div>
  );
}

const LoadingSpinner = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <svg
        className="h-4 w-4 animate-spin text-blue-500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="8"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        ></path>
      </svg>
    </div>
  );
};

import { NumberInput } from "@ark-ui/react/number-input";
import { ChevronUpIcon } from "@radix-ui/react-icons";

export const NumberEditorInteger: EditRenderer<SalaryData> = ({ value, onChange }) => {
  return (
    <NumberInput.Root
      className="border-ln-gray-30 flex h-full w-full items-center rounded border"
      value={`${value}`}
      onValueChange={(d) => onChange(d.valueAsNumber)}
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
      <NumberInput.Control className="flex w-[16px] flex-col">
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

export const NumberEditor: EditRenderer<SalaryData> = ({ value, onChange }) => {
  return (
    <NumberInput.Root
      className="border-ln-gray-30 flex h-full w-full items-center rounded border"
      value={`${value}`}
      onValueChange={(d) => onChange(d.valueAsNumber)}
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
      <NumberInput.Control className="flex w-[16px] flex-col">
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

export const TextEditor: EditRenderer<SalaryData> = ({ value, onChange }) => {
  return (
    <input
      className="border-ln-gray-30 h-full w-full rounded border"
      value={`${value}`}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};
