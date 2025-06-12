import type {
  HTMLAttributes,
  InputHTMLAttributes,
  ButtonHTMLAttributes,
  LabelHTMLAttributes,
} from "react";

export interface GetProps<T> {
  getInputProps: () => InputHTMLAttributes<HTMLInputElement>;
  getLabelProps: () => LabelHTMLAttributes<HTMLLabelElement>;
  getToggleProps: () => ButtonHTMLAttributes<HTMLButtonElement>;
  getClearProps: () => ButtonHTMLAttributes<HTMLButtonElement>;
  getFocusCaptureProps: () => HTMLAttributes<HTMLElement>;
  getListProps: () => HTMLAttributes<HTMLElement>;
  getItemProps: (option: { index: number; item: T }) => HTMLAttributes<HTMLElement>;
}

export interface ContextualOrReturn<T> {
  isItemSelected: (item: T) => boolean;
}

export interface AutocompleteReturn<T> extends ContextualOrReturn<T> {
  inputRef: React.RefObject<HTMLInputElement | null>;
  focusIndex: number;
  setFocusIndex: (index: number) => void;
  open: boolean;
  setOpen: (value: boolean) => void;
}

export interface Equality<T> {
  isEqual: (itemA: T | undefined, itemB: T | undefined) => boolean;
}

export interface PassthroughProps<T> {
  isItemDisabled?: (item: T) => boolean;
  isItemAction?: (item: T) => boolean;
  onAction?: (item: T) => void;
  value: string | undefined;
  onChange: (value?: string) => void;
  items: T[];
}

export interface AdapterProps<T> extends ContextualOrReturn<T> {
  selected: T[] | T | undefined;
  onSelectChange: (item?: T) => void;
  removeSelect?: (item?: T) => void;
}

export interface Contextual<T>
  extends PassthroughProps<T>,
    AdapterProps<T>,
    Equality<T>,
    AutocompleteReturn<T> {
  id?: string;
  tmpValue?: string;
  setTmpValue: (value?: string) => void;
  getItemValue: (item: T | undefined | null) => string;
}

export interface FeatureState {
  isInputEmpty: boolean;
}

export interface FeatureProps<T> {
  rovingText?: boolean;
  select?: boolean;
  deselectOnClear?: boolean;
  deselectOnChange?: boolean;
  closeOnSelect?: boolean;
  toggleRef?: React.RefObject<HTMLButtonElement | null>;
  onRequestItem: (
    event: { value: string },
    res: (data: { index: number; item: T }) => void,
  ) => void;
}

export type AutocompleteFeatureProps<T> = Pick<
  FeatureProps<T>,
  "rovingText" | "select" | "deselectOnClear" | "deselectOnChange" | "closeOnSelect"
>;

export type Feature<T, Yield extends object> = (cx: Contextual<T>) => Yield;

export type MergedFeatureYield<T, Features> = Features extends readonly [Feature<T, infer S>]
  ? S
  : Features extends readonly [Feature<T, infer F>, ...infer R]
    ? F & MergedFeatureYield<T, R>
    : never;

export type MergedFeature<T, Features> = Feature<T, MergedFeatureYield<T, Features>>;

export type BaseProps<T, FeatureYield extends object> = PassthroughProps<T> & {
  feature: Feature<T, FeatureYield>;
  inputRef?: React.RefObject<HTMLInputElement | null>;
};

export type AutocompleteProps<T, FeatureYield extends object> = BaseProps<T, FeatureYield> &
  AdapterProps<T> &
  Partial<GetItemValue<T>> &
  Equality<T>;

export type GetItemValue<T> = {
  getItemValue: (item: T) => string;
};

export type MaybeGetItemValue<T> = T extends string ? Partial<GetItemValue<T>> : GetItemValue<T>;

export type Flippable = {
  flipOnSelect?: boolean;
};

export type ComboboxProps<T, FeatureYield extends object = object> = BaseProps<T, FeatureYield> &
  MaybeGetItemValue<T> &
  Partial<Equality<T>> &
  Flippable & {
    selected?: T | undefined;
    onSelectChange?: ((item?: T) => void) | undefined;
  };

export type MultiSelectProps<T, FeatureYield extends object = object> = BaseProps<T, FeatureYield> &
  MaybeGetItemValue<T> &
  Partial<Equality<T>> &
  Flippable & {
    selected: T[];
    onSelectChange?: (items: T[]) => void;
  };
