import {
  useMultiSelect as useMulti,
  multiSelect,
} from "@1771technologies/lytenyte-react-autocomplete";
import { useEvent } from "@1771technologies/lytenyte-react-hooks";
import { useCallback, useMemo, useState } from "react";
import { smartStringIncludes } from "@1771technologies/lytenyte-js-utils";
import type { MultiSelectContext } from "./context.js";

export type MultiSelectItem = { id: string };
export interface UseMultiSelectArgs<T extends MultiSelectItem> {
  readonly items: T[];
  readonly timeEnter?: number;
  readonly timeExit?: number;

  readonly onSelect?: (item: T[]) => void;
  readonly selected?: T[];
  readonly allowDeselect?: boolean;

  readonly filterPredicate?: (query: string | undefined, t: T) => boolean;

  readonly closeOnSelect?: boolean;

  readonly isDrop?: boolean;
}

export function useMultiSelect<T extends MultiSelectItem>({
  items,
  timeEnter = 0,
  timeExit = 0,

  onSelect: providedOnSelect,
  selected: providedSelect,

  filterPredicate = (q, t) => !q || smartStringIncludes(t.id, q),

  allowDeselect,
  closeOnSelect,
}: UseMultiSelectArgs<T>) {
  const lookup = useMemo(() => new Map(items.map((c) => [c.id, c])), [items]);

  const [value, setValue] = useState<string>();
  const [localSelected, setLocalSelect] = useState<T[]>([]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      return filterPredicate(value, item);
    });
  }, [filterPredicate, items, value]);
  const options = useMemo(() => filteredItems.map((c) => c.id), [filteredItems]);

  const selected = providedSelect ?? localSelected;

  const selectedIds = useMemo(() => {
    return selected.map((c) => c.id);
  }, [selected]);

  const onSelect = useEvent((ids: string[]) => {
    const items = ids.map((c) => lookup.get(c)!);
    providedOnSelect?.(items);
    setLocalSelect(items);
  });

  const [toggle, setToggle] = useState<HTMLElement | null>(null);
  const [input, setInput] = useState<HTMLInputElement | null>(null);

  const {
    getLabelProps,
    getFocusCaptureProps,
    getInputProps,
    getClearProps,
    getToggleProps,
    getListProps,

    removeSelect: remove,
    isItemSelected,
    isTagActive,

    open,
    focusIndex,
    isInputEmpty,

    getItemProps: getItem,
  } = useMulti({
    feature: multiSelect({ closeOnSelect }),

    flipOnSelect: allowDeselect,
    items: options,

    selected: selectedIds,
    onSelectChange: onSelect,

    onChange: setValue,
    value,
  });

  const getItemProps = useCallback(
    (id: string, index: number) => getItem({ index, item: id }),
    [getItem],
  );

  const context = useMemo<MultiSelectContext>(() => {
    return {
      getInputProps,
      getClearProps,
      getToggleProps,
      getListProps,
      getItemProps,
      getFocusCaptureProps,
      getLabelProps,

      input,
      setInput,
      toggle,
      setToggle,

      removeSelect: remove,
      isItemSelected,
      isTagActive,

      timeEnter,
      timeExit,

      isDrop: false,
      state: {
        focusIndex,
        isInputEmpty,
        open,
        selected: selectedIds,
      },
    };
  }, [
    focusIndex,
    getClearProps,
    getFocusCaptureProps,
    getInputProps,
    getItemProps,
    getLabelProps,
    getListProps,
    getToggleProps,
    input,
    isInputEmpty,
    isItemSelected,
    isTagActive,
    open,
    remove,
    selectedIds,
    timeEnter,
    timeExit,
    toggle,
  ]);

  const state = useMemo(() => {
    return {
      open,
      selected,
      lookup,
      options,
      remove,
      isInputEmpty,
      isItemSelected,
      isTagActive,
    };
  }, [isInputEmpty, isItemSelected, isTagActive, lookup, open, options, remove, selected]);

  return { state, context };
}
