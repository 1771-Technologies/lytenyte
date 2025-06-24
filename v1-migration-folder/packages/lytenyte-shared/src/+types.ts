/**
 *
 */
export interface ColumnGroupMeta {
  /**
   *
   */
  readonly colIdToGroupIds: Map<string, string[]>;

  /**
   *
   */
  readonly validGroupIds: Set<string>;

  /**
   *
   */
  readonly groupIsCollapsible: Map<string, boolean>;
}

/**
 *
 */
export type ColumnGroupVisibility = "always" | "close" | "open";

/**
 *
 */
export type ColumnPin = "start" | "end" | null;

/**
 *
 */
export interface RowDataStore {
  /**
   *
   */
  readonly rowCount: GridAtomReadonly<number>;

  /**
   *
   */
  readonly rowTopCount: GridAtom<number>;

  /**
   *
   */
  readonly rowCenterCount: GridAtom<number>;

  /**
   *
   */
  readonly rowBottomCount: GridAtom<number>;
}

/**
 *
 */
export interface GridAtom<T> {
  /**
   *
   */
  readonly get: () => T;

  /**
   *
   */
  readonly set: (v: T | ((p: T) => T)) => void;

  /**
   *
   */
  readonly watch: (fn: () => void) => () => void;

  /**
   *
   */
  readonly useValue: () => T;
}

/**
 *
 */
export interface GridAtomReadonly<T> {
  /**
   *
   */
  readonly get: () => T;

  /**
   *
   */
  readonly watch: (fn: () => void) => () => void;

  /**
   *
   */
  readonly useValue: () => T;
}
