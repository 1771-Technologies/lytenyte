import type { RowDataSourceEnterprise } from "../row-data-source/rds-pro";
import type { AggModel } from "../types";
import type {
  CellSelectionMode,
  CellSelectionRect,
  ClipboardTransformCellValue,
  ClipboardTransformCopy,
  ClipboardTransformHeader,
  ClipboardTransformHeaderGroup,
  ClipboardTransformPaste,
  ColumnFilterModel,
  ColumnMenuRenderer,
  ContextMenuRenderer,
  DialogFrame,
  OverlayId,
  Overlays,
  PanelFrame,
  PopoverFrame,
} from "../types-pro";
import type { PropsCommunity } from "./props-community";

export interface PropsEnterprise<A, D, C, E, Base, Group>
  extends Omit<PropsCommunity<A, D, C, E, Base, Group>, "filterModel" | "rowDataSource"> {
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

  readonly measureModel?: AggModel<A>;

  readonly rowDataSource?: RowDataSourceEnterprise<A, D, C>;

  readonly treeData?: boolean;
}
