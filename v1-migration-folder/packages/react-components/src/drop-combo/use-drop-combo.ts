import { dropdown, useCombobox } from "@1771technologies/lytenyte-react-autocomplete";
import { useEvent } from "@1771technologies/lytenyte-react-hooks";
import { useCallback, useMemo, useState } from "react";
import type { DropComboContext } from "./context.js";
import { smartStringIncludes } from "@1771technologies/lytenyte-js-utils";

export type DropItem = { id: string };
export interface UseDropComboArgs<T extends DropItem> {
  readonly items: T[];
  readonly timeEnter?: number;
  readonly timeExit?: number;

  readonly onSelect?: (item?: T) => void;
  readonly selected?: T | null;
  readonly allowDeselect?: boolean;

  readonly filterPredicate?: (query: string | undefined, t: T) => boolean;

  readonly closeOnSelect?: boolean;
}

export function useDropCombo<T extends DropItem>({
  items,
  timeEnter = 0,
  timeExit = 0,

  onSelect: providedOnSelect,
  selected: providedSelect,

  filterPredicate = (q, t) => !q || smartStringIncludes(t.id, q),

  allowDeselect,
  closeOnSelect,
}: UseDropComboArgs<T>) {
  const [value, setValue] = useState<string>();
  const [localSelected, setLocalSelect] = useState<T>();

  const lookup = useMemo(() => new Map(items.map((c) => [c.id, c])), [items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      return filterPredicate(value, item);
    });
  }, [filterPredicate, items, value]);
  const options = useMemo(() => filteredItems.map((c) => c.id), [filteredItems]);

  const onSelect = useEvent((id?: string) => {
    const item = id ? lookup.get(id) : undefined;
    providedOnSelect?.(item);
    setLocalSelect(item);
  });

  const selected = providedSelect ?? localSelected;

  const [toggle, setToggle] = useState<HTMLElement | null>(null);
  const [input, setInput] = useState<HTMLInputElement | null>(null);

  const {
    getInputProps,
    getClearProps,
    getToggleProps,
    getListProps,

    open,
    focusIndex,
    isInputEmpty,

    getItemProps: getItem,
  } = useCombobox({
    flipOnSelect: allowDeselect,
    items: options,

    feature: dropdown({ closeOnSelect }),

    onChange: setValue,
    value,

    selected: selected?.id,
    onSelectChange: onSelect,
  });

  const getItemProps = useCallback(
    (id: string, index: number) => getItem({ index, item: id }),
    [getItem],
  );

  const context = useMemo<DropComboContext>(() => {
    return {
      getInputProps,
      getClearProps,
      getToggleProps,
      getListProps,
      getItemProps,

      input,
      setInput,
      toggle,
      setToggle,

      timeEnter,
      timeExit,

      state: {
        focusIndex,
        isInputEmpty,
        open,
        selected: selected?.id,
      },
    };
  }, [
    focusIndex,
    getClearProps,
    getInputProps,
    getItemProps,
    getListProps,
    getToggleProps,
    input,
    isInputEmpty,
    open,
    selected?.id,
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
    };
  }, [lookup, open, options, selected]);

  return { state, context };
}
