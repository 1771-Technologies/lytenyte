export type UIHintsColumnHeader = {
  readonly columnMenu?: boolean;
  readonly sortButton?: boolean;
  readonly showAggName?: boolean;
} & {
  readonly [key: string]: any;
};

// Simplified
export type UIHintsColumnHeaderPro = UIHintsColumnHeader;
