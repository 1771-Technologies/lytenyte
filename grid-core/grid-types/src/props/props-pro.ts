import type { RowDataSourcePro } from "../row-data-source/rds-pro";
import type { AggModel } from "../types/aggregations";
import type { CellSelectionMode, CellSelectionRect } from "../types/cell-selection-pro";
import type {
  ClipboardTransformCellValue,
  ClipboardTransformCopy,
  ClipboardTransformHeader,
  ClipboardTransformHeaderGroup,
  ClipboardTransformPaste,
} from "../types/clipboard-pro";
import type { ColumnMenuRenderer } from "../types/column-menu-pro";
import type {
  DialogFrame,
  MenuFrame,
  PanelFrame,
  PopoverFrame,
} from "../types/component-frames-pro";
import type { ContextMenuRenderer } from "../types/context-menu-pro";
import type { ColumnFilterModel } from "../types/filter-pro";
import type { OverlayId, Overlays } from "../types/overlay-pro";
import type { PropsCoreRaw } from "./props-core";

export interface PropsProRaw<A, D, C, E, Base, Group>
  extends Omit<PropsCoreRaw<A, D, C, E, Base, Group>, "filterModel" | "rowDataSource"> {
  readonly overlayToShow?: OverlayId | null;
  readonly overlays?: Overlays<A, E>;

  readonly cellSelections?: CellSelectionRect[];
  readonly cellSelectionMode?: CellSelectionMode;

  readonly columnMenuRenderer?: null | ColumnMenuRenderer<A, C, E>;

  readonly columnPivotModeIsOn?: boolean;
  readonly columnPivotModel?: string[];

  readonly contextMenuRenderer?: null | ContextMenuRenderer<A, E>;

  readonly clipboardTransformCellValue?: ClipboardTransformCellValue<A, D, C> | null;
  readonly clipboardTransformHeader?: ClipboardTransformHeader<A, C> | null;
  readonly clipboardTransformHeaderGroup?: ClipboardTransformHeaderGroup<A, C> | null;

  readonly clipboardTransformCopy?: ClipboardTransformCopy<A> | null;
  readonly clipboardTransformPaste?: ClipboardTransformPaste<A> | null;

  readonly filterModel?: ColumnFilterModel<A, D>;
  readonly filterQuickSearch?: string | null;

  readonly panelFrames?: Record<string, PanelFrame<A, E>>;
  readonly panelFrameButtons?: { label: string; id: string; icon?: () => E }[];

  readonly dialogFrames?: Record<string, DialogFrame<A, E>>;
  readonly popoverFrames?: Record<string, PopoverFrame<A, E>>;
  readonly menuFrames?: Record<string, MenuFrame<A, E>>;

  readonly measureModel?: AggModel<A>;

  readonly rowDataSource?: RowDataSourcePro<A, D, C>;

  readonly treeData?: boolean;
}
