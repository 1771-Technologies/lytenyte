import type { LayoutCell, RowNode } from "@1771technologies/lytenyte-shared";
import type { Column } from "./column.js";
import type { GridSpec } from "./grid.js";
import type { JSX } from "react";
import type { API } from "./api.js";

export type Events = {
  [key in keyof Required<JSX.IntrinsicElements["div"]> as key extends `on${string}`
    ? key
    : never]: JSX.IntrinsicElements["div"][key];
};

type CellEvents<Spec extends GridSpec = GridSpec> = {
  [key in keyof Required<JSX.IntrinsicElements["div"]> as key extends `on${infer X}`
    ? Uncapitalize<X>
    : never]: (params: {
    event: Parameters<JSX.IntrinsicElements["div"][key]>[0];
    column: Column<Spec>;
    row: RowNode<Spec["data"]>;
    layout: LayoutCell;
    api: API<Spec>;
  }) => void;
};

type RowEvents<Spec extends GridSpec = GridSpec> = {
  [key in keyof Required<JSX.IntrinsicElements["div"]> as key extends `on${infer X}`
    ? Uncapitalize<X>
    : never]: (params: {
    event: Parameters<JSX.IntrinsicElements["div"][key]>[0];
    row: RowNode<Spec["data"]>;
    api: API<Spec>;
  }) => void;
};

type HeaderEvents<Spec extends GridSpec = GridSpec> = {
  [key in keyof Required<JSX.IntrinsicElements["div"]> as key extends `on${infer X}`
    ? Uncapitalize<X>
    : never]: (params: {
    event: Parameters<JSX.IntrinsicElements["div"][key]>[0];
    column: Column<Spec>;
    api: API<Spec>;
  }) => void;
};

type HeaderGroupEvents<Spec extends GridSpec = GridSpec> = {
  [key in keyof Required<JSX.IntrinsicElements["div"]> as key extends `on${infer X}`
    ? Uncapitalize<X>
    : never]: (params: {
    event: Parameters<JSX.IntrinsicElements["div"][key]>[0];
    groupPath: string[];
    columns: Column<Spec>[];
    api: API<Spec>;
  }) => void;
};

type ViewportEvents<Spec extends GridSpec = GridSpec> = {
  [key in keyof Required<JSX.IntrinsicElements["div"]> as key extends `on${infer X}`
    ? Uncapitalize<X>
    : never]: (params: {
    event: Parameters<JSX.IntrinsicElements["div"][key]>[0];
    viewport: HTMLElement;
    api: API<Spec>;
  }) => void;
};

export type GridEvents<Spec extends GridSpec = GridSpec> = {
  readonly cell?: Partial<CellEvents<Spec>>;
  readonly row?: Partial<RowEvents<Spec>>;
  readonly headerCell?: Partial<HeaderEvents<Spec>>;
  readonly headerGroup?: Partial<HeaderGroupEvents<Spec>>;
  readonly viewport?: Partial<ViewportEvents<Spec>>;
};
