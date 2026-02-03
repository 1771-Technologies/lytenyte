export type BaseOption = {
  readonly id: string;
  readonly selectable?: boolean;
};

export type BasicSelect<T extends BaseOption> = {
  readonly kind: "basic";
  readonly value: T | null;
  readonly onOptionChange: (change: T | null) => void;
  readonly options: T[];
};
export type MultiSelect<T extends BaseOption> = {
  readonly kind: "multi";
  readonly value: T[];
  readonly onOptionChange: (change: T[]) => void;
  readonly options: T[];
};

export type ComboSelect<T extends BaseOption> = {
  readonly kind: "combo";
  readonly value: T | null;
  readonly onOptionChange: (change: T | null) => void;

  readonly query?: string;
  readonly onQueryChange?: (change: string) => void;

  readonly searchDebounceMs?: number;
  readonly clearOnSelect?: boolean;
  readonly clearOnQuery?: boolean;

  readonly options: (query: string | null) => Promise<T[]> | T[];
};

export type MultiComboSelect<T extends BaseOption> = {
  readonly kind: "multi-combo";
  readonly value: T[];
  readonly onOptionChange: (change: T[]) => void;

  readonly query?: string;
  readonly onQueryChange?: (change: string) => void;

  readonly searchDebounceMs?: number;
  readonly clearOnSelect?: boolean;
  readonly clearOnQuery?: boolean;

  readonly options: (query: string | null) => Promise<T[]> | T[];
};

export type SmartSelectKinds<T extends BaseOption> =
  | BasicSelect<T>
  | MultiSelect<T>
  | ComboSelect<T>
  | MultiComboSelect<T>;

export type OptionRenderProps<T extends BaseOption> = {
  readonly option: T;
  readonly active: boolean;
  readonly selected: boolean;
};
