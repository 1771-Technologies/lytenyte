import { autocomplete, useCombobox } from "@1771technologies/lytenyte-react-autocomplete";
import { useEvent } from "@1771technologies/lytenyte-react-hooks";
import { useCallback, useMemo, useState } from "react";
import type { SelectContext } from "./context";

export type SelectItem = { id: string };
export interface UseSelectArgs<T extends SelectItem> {
  readonly items: T[];
  readonly timeEnter?: number;
  readonly timeExit?: number;
}

export function useSelect<T extends SelectItem>({
  items,
  timeEnter = 0,
  timeExit = 0,
}: UseSelectArgs<T>) {
  const [value, setValue] = useState<string>();
  const [selected, setSelected] = useState<string>();

  const options = useMemo(() => items.map((c) => c.id), [items]);
  const lookup = useMemo(() => new Map(items.map((c) => [c.id, c])), [items]);
  const [input, setInput] = useState<HTMLInputElement | null>(null);

  const {
    getFocusCaptureProps,
    getLabelProps,
    getInputProps,
    getClearProps,
    getToggleProps,
    getListProps,

    focusIndex,
    isInputEmpty,
    isItemSelected,
    setFocusIndex,
    open,
    setOpen,

    getItemProps: getItem,
  } = useCombobox({
    items: options,

    feature: autocomplete({ select: true }),

    onChange: setValue,
    value: value,

    selected,
    onSelectChange: setSelected,
  });

  const getItemById = useEvent((id: string) => lookup.get(id));
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
        selected,
        value,
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
    selected,
    timeEnter,
    timeExit,
    value,
  ]);

  const state = useMemo(() => {
    return {
      getItemById,
      lookup,
      options,

      open: open,
      setOpen,
      focusIndex,
      setFocusIndex,
      isInputEmpty,
      isItemSelected,
    };
  }, [
    focusIndex,
    getItemById,
    isInputEmpty,
    isItemSelected,
    lookup,
    open,
    options,
    setFocusIndex,
    setOpen,
  ]);

  return { state, context };
}
