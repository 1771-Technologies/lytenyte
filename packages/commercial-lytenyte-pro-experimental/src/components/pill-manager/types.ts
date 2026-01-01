export interface PillItemSpec {
  readonly id: string;
  readonly active: boolean;
  readonly movable?: boolean;
  readonly tags?: string[];
  readonly data?: unknown;
  readonly removable?: boolean;
}

export interface PillState {
  readonly expanded: boolean;
  readonly expandToggle: (s?: boolean) => void;
  readonly row: PillRowSpec;
}

export interface PillRowSpec {
  readonly id: string;
  readonly pills: PillItemSpec[];
  readonly accepts?: string[];
  readonly label?: string;
  readonly type?: "columns" | "row-groups" | "row-pivots" | "column-pivots" | ({} & string);
}
