import type { RowNode } from "@1771technologies/lytenyte-shared";
import type { Column } from "./column.js";
import type { GridSpec } from "./grid.js";
import type { JSX } from "react";

export type Events = {
  [key in keyof Required<JSX.IntrinsicElements["div"]> as key extends `on${string}`
    ? key
    : never]: JSX.IntrinsicElements["div"][key];
};

type CellEvents<Spec extends GridSpec = GridSpec> = {
  [key in keyof Required<JSX.IntrinsicElements["div"]> as key extends `on${infer X}`
    ? Uncapitalize<X>
    : never]: (
    column: Column<Spec>,
    row: RowNode<Spec["data"]>,
    event: Parameters<JSX.IntrinsicElements["div"][key]>[0],
  ) => void;
};

type RowEvents<Spec extends GridSpec = GridSpec> = {
  [key in keyof Required<JSX.IntrinsicElements["div"]> as key extends `on${infer X}`
    ? Uncapitalize<X>
    : never]: (row: RowNode<Spec["data"]>, event: Parameters<JSX.IntrinsicElements["div"][key]>[0]) => void;
};

type HeaderEvents<Spec extends GridSpec = GridSpec> = {
  [key in keyof Required<JSX.IntrinsicElements["div"]> as key extends `on${infer X}`
    ? Uncapitalize<X>
    : never]: (column: Column<Spec>, event: Parameters<JSX.IntrinsicElements["div"][key]>[0]) => void;
};

type HeaderGroupEvents<Spec extends GridSpec = GridSpec> = {
  [key in keyof Required<JSX.IntrinsicElements["div"]> as key extends `on${infer X}`
    ? Uncapitalize<X>
    : never]: (
    groupPath: string[],
    columns: Column<Spec>[],
    event: Parameters<JSX.IntrinsicElements["div"][key]>[0],
  ) => void;
};

type ViewportEvents = {
  [key in keyof Required<JSX.IntrinsicElements["div"]> as key extends `on${infer X}`
    ? Uncapitalize<X>
    : never]: (viewport: HTMLElement, event: Parameters<JSX.IntrinsicElements["div"][key]>[0]) => void;
};

export type GridEvents<Spec extends GridSpec = GridSpec> = {
  readonly cell?: Partial<CellEvents<Spec>>;
  readonly row?: Partial<RowEvents<Spec>>;
  readonly headerCell?: Partial<HeaderEvents<Spec>>;
  readonly headerGroup?: Partial<HeaderGroupEvents<Spec>>;
  readonly viewport?: Partial<ViewportEvents>;
};
