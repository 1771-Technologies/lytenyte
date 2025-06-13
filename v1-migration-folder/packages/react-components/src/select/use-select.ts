import { autocomplete, useCombobox } from "@1771technologies/lytenyte-react-autocomplete";
import { useEvent } from "@1771technologies/lytenyte-react-hooks";
import { useCallback, useMemo, useState } from "react";
import type { SelectContext } from "./context.js";

export type SelectItem = { id: string };
export interface UseSelectArgs<T extends SelectItem> {
  readonly items: T[];
  readonly timeEnter?: number;
  readonly timeExit?: number;

  readonly onSelect?: (item?: T) => void;
  readonly selected?: T | null;
  readonly itemToString?: (t?: T) => string;
}

export function useSelect<T extends SelectItem>({
  items,
  timeEnter = 0,
  timeExit = 0,

  onSelect: providedOnSelect,
  selected: providedSelect,

  itemToString = (t) => t?.id ?? "",
}: UseSelectArgs<T>) {
  const [localSelected, setLocalSelect] = useState<T>();

  const options = useMemo(() => items.map((c) => c.id), [items]);
  const lookup = useMemo(() => new Map(items.map((c) => [c.id, c])), [items]);
  const [input, setInput] = useState<HTMLInputElement | null>(null);

  const onSelect = useEvent((id?: string) => {
    const item = id ? lookup.get(id) : undefined;
    providedOnSelect?.(item);
    setLocalSelect(item);
  });

  const selected = providedSelect ?? localSelected;

  const {
    getFocusCaptureProps,
    getLabelProps,
    getInputProps,
    getClearProps,
    getToggleProps,
    getListProps,

    open,
    focusIndex,
    isInputEmpty,

    getItemProps: getItem,
  } = useCombobox({
    items: options,

    feature: autocomplete({ select: true }),

    onChange: () => {},
    value: itemToString(selected),

    selected: selected?.id,
    onSelectChange: onSelect,
  });

  const getItemProps = useCallback(
    (id: string, index: number) => getItem({ index, item: id }),
    [getItem],
  );

  const context = useMemo<SelectContext>(() => {
    return {
      getFocusCaptureProps,
      getLabelProps,
      getInputProps,
      getClearProps,
      getToggleProps,
      getListProps,
      getItemProps,
      input,
      setInput,

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
    getFocusCaptureProps,
    getInputProps,
    getItemProps,
    getLabelProps,
    getListProps,
    getToggleProps,
    input,
    isInputEmpty,
    open,
    selected?.id,
    timeEnter,
    timeExit,
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
