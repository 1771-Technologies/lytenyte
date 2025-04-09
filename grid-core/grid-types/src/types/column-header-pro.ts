export type UIHintsColumnHeader = {
  readonly columnMenu?: boolean;
  readonly sortButton?: boolean;
} & {
  readonly [key: string]: boolean;
};

// Simplified
export type UIHintsColumnHeaderPro = UIHintsColumnHeader;
