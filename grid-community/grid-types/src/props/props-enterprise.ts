import type { RowDataSourceEnterprise } from "../row-data-source/rds-enterprise";
import type {
  CellSelectionMode,
  CellSelectionRect,
  ClipboardTransformCellValue,
  ClipboardTransformCopy,
  ClipboardTransformHeader,
  ClipboardTransformHeaderGroup,
  ClipboardTransformPaste,
  ColumnFilter,
  ContextMenuItems,
  FloatingFrame,
  PanelFrame,
} from "../types-enterprise";
import type { PropsCommunity } from "./props-community";

export interface PropsEnterprise<A, D, C, E, Base, Group>
  extends Omit<PropsCommunity<A, D, C, E, Base, Group>, "filterModel" | "rowDataSource"> {
  readonly cellSelections?: CellSelectionRect[];
  readonly cellSelectionMode?: CellSelectionMode;

  readonly columnPivotModeIsOn?: boolean;
  readonly columnPivotModel?: string[];

  readonly columnMenuState?: any;

  readonly contextMenuItems?: ContextMenuItems<A, E> | null;

  readonly clipboardTransformCellValue?: ClipboardTransformCellValue<A, D, C> | null;
  readonly clipboardTransformHeader?: ClipboardTransformHeader<A, C> | null;
  readonly clipboardTransformHeaderGroup?: ClipboardTransformHeaderGroup<A, C> | null;

  readonly clipboardTransformCopy?: ClipboardTransformCopy<A> | null;
  readonly clipboardTransformPaste?: ClipboardTransformPaste<A> | null;

  readonly filterModel?: ColumnFilter<A, D>[];
  readonly filterQuickSearch?: string | null;

  readonly floatingFrames?: Record<string, FloatingFrame<A, E>>;

  readonly panelFrames?: Record<string, PanelFrame<A, E>>;
  readonly panelFrameButtons?: { label: string; id: string; icon?: () => E }[];

  readonly measureModel?: string[];

  readonly rowDataSource?: RowDataSourceEnterprise<A, D, C>;

  readonly rowGroupBarDisplayMode?: "always" | "only-when-grouping" | "never";

  readonly treeData?: boolean;
}
