import type { RowSource as RowSourceCore } from "@1771technologies/lytenyte-shared";
import type { Column } from "./column";
import type { GridSpec } from "./grid";

export interface RowSource<Spec extends GridSpec = GridSpec> extends RowSourceCore<Spec["data"]> {
  readonly useColumnOverride: () => null | Column<Spec>;
}
