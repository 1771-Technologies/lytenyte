import type {
  RowGroupKindCore,
  RowLeafKindCore,
  SortCycleOptionCore,
} from "@1771technologies/grid-types/core";

export const ROW_LEAF_KIND: RowLeafKindCore = 1;
export const ROW_GROUP_KIND: RowGroupKindCore = 2;

export const COLUMN_GROUP_ID_DELIMITER = "-->";
export const ROW_DEFAULT_PATH_SEPARATOR = "-->";

export const COLUMN_EMPTY_PREFIX = "lytenyte-empty:";
export const COLUMN_MARKER_ID = "lytenyte-marker-column";

export const GROUP_COLUMN_PREFIX = "lytenyte-group-column:";
export const GROUP_COLUMN_MULTI_PREFIX = `${GROUP_COLUMN_PREFIX}:multi:`;
export const GROUP_COLUMN_SINGLE_ID = `${GROUP_COLUMN_PREFIX}:single`;
export const GROUP_COLUMN_TREE_DATA = `${GROUP_COLUMN_PREFIX}:tree`;

export const COLUMN_GROUP_HEADER_HEIGHT = 28;
export const COLUMN_HEADER_HEIGHT = 32;
export const COLUMN_SCAN_DISTANCE = 20;
export const PAGINATE_PAGE_SIZE = 50;

export const ROW_HEIGHT = 32;
export const ROW_DETAIL_HEIGHT = 300;
export const ROW_UPDATE_STACK_SIZE = 20;

export const DEFAULT_MAX_WIDTH = 1000;
export const DEFAULT_MIN_WIDTH = 80;
export const DEFAULT_WIDTH = 150;

export const DEFAULT_SORT_CYCLE: SortCycleOptionCore[] = ["asc", "desc", null];

export const GRID_CELL_POSITION = 1;
export const FULL_WIDTH_POSITION = 2;
export const HEADER_CELL_POSITION = 3;
export const HEADER_GROUP_CELL_POSITION = 4;
export const FLOATING_CELL_POSITION = 5;

export const FULL_ENCODING = -2;
export const END_ENCODING = -1;
