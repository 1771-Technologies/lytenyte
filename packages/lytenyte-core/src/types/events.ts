import type {
  LayoutCell,
  LayoutFullWidthRow,
  LayoutHeaderCell,
  LayoutHeaderFloating,
  LayoutHeaderGroup,
  LayoutRowWithCells,
  RowNode,
} from "@1771technologies/lytenyte-shared";
import type { JSX } from "react";
import type { Grid } from "../index.js";

export type Events = {
  [key in keyof Required<JSX.IntrinsicElements["div"]> as key extends `on${string}`
    ? key
    : never]: JSX.IntrinsicElements["div"][key];
};

type CellEvents<Spec extends Grid.GridSpec = Grid.GridSpec> = {
  [key in keyof Required<JSX.IntrinsicElements["div"]> as key extends `on${infer X}`
    ? Uncapitalize<X>
    : never]: (params: {
    event: Parameters<JSX.IntrinsicElements["div"][key]>[0];
    column: Grid.Column<Spec>;
    row: RowNode<Spec["data"]>;
    layout: LayoutCell;
    api: Grid.API<Spec>;
  }) => void;
};

type RowEvents<Spec extends Grid.GridSpec = Grid.GridSpec> = {
  [key in keyof Required<JSX.IntrinsicElements["div"]> as key extends `on${infer X}`
    ? Uncapitalize<X>
    : never]: (params: {
    event: Parameters<JSX.IntrinsicElements["div"][key]>[0];
    row: RowNode<Spec["data"]>;
    layout: LayoutRowWithCells | LayoutFullWidthRow;
    api: Grid.API<Spec>;
  }) => void;
};

type HeaderEvents<Spec extends Grid.GridSpec = Grid.GridSpec> = {
  [key in keyof Required<JSX.IntrinsicElements["div"]> as key extends `on${infer X}`
    ? Uncapitalize<X>
    : never]: (params: {
    event: Parameters<JSX.IntrinsicElements["div"][key]>[0];
    layout: LayoutHeaderCell | LayoutHeaderFloating;
    column: Grid.Column<Spec>;
    api: Grid.API<Spec>;
  }) => void;
};

type HeaderGroupEvents<Spec extends Grid.GridSpec = Grid.GridSpec> = {
  [key in keyof Required<JSX.IntrinsicElements["div"]> as key extends `on${infer X}`
    ? Uncapitalize<X>
    : never]: (params: {
    event: Parameters<JSX.IntrinsicElements["div"][key]>[0];
    layout: LayoutHeaderGroup;
    columns: Grid.Column<Spec>[];
    api: Grid.API<Spec>;
  }) => void;
};

type ViewportEvents<Spec extends Grid.GridSpec = Grid.GridSpec> = {
  [key in keyof Required<JSX.IntrinsicElements["div"]> as key extends `on${infer X}`
    ? Uncapitalize<X>
    : never]: (params: {
    event: Parameters<JSX.IntrinsicElements["div"][key]>[0];
    viewport: HTMLElement;
    api: Grid.API<Spec>;
  }) => void;
};

export type GridEvents<Spec extends Grid.GridSpec = Grid.GridSpec> = {
  readonly cell?: Partial<CellEvents<Spec>>;
  readonly row?: Partial<RowEvents<Spec>>;
  readonly headerCell?: Partial<HeaderEvents<Spec>>;
  readonly headerGroup?: Partial<HeaderGroupEvents<Spec>>;
  readonly viewport?: Partial<ViewportEvents<Spec>>;
};
