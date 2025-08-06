import type { Feature, GetProps, AutocompleteFeatureProps, FeatureState } from "../../types.js";
import { getId, buttonProps, defaultFocusIndex } from "../../common.js";
import { useFocusCapture } from "../../hooks/use-focus-capture.js";

type AutocompleteLiteFeature<T> = Feature<
  T,
  Pick<
    GetProps<T>,
    "getInputProps" | "getListProps" | "getItemProps" | "getClearProps" | "getFocusCaptureProps"
  > &
    FeatureState
>;

const scrollIntoView = (element: HTMLElement | null) =>
  element?.scrollIntoView({ block: "nearest" });

const autocompleteLite =
  <T>({
    select,
    rovingText = !select,
    deselectOnClear = true,
    deselectOnChange = true,
    closeOnSelect = true,
  }: AutocompleteFeatureProps<T> = {}): AutocompleteLiteFeature<T> =>
  ({
    getItemValue,
    onSelectChange,
    isItemSelected,
    isItemDisabled,
    isItemAction,
    onAction,
    selected,
    value,
    onChange,
    tmpValue,
    setTmpValue,
    focusIndex,
    setFocusIndex,
    open,
    setOpen,
    inputRef,
    items,
    id,
  }) => {
    const [startCapture, inCapture, stopCapture] = useFocusCapture(inputRef);

    const inputValue =
      (tmpValue || value) ?? (Array.isArray(selected) ? "" : getItemValue(selected));
    const focusItem = items[focusIndex];
    const listId = getId(id, "l");

    const selectItemOrAction = (item: T) => {
      if (isItemAction?.(item)) {
        onAction?.(item);
        return true; // Always close list on action
      }

      const itemValue = getItemValue(item);
      if (!select) onChange(itemValue);
      const endIndex = itemValue.length;
      inputRef.current?.setSelectionRange(endIndex, endIndex);
      // We place onSelectChange after onChange to give user an opportunity
      // to manipulate the `value` state
      onSelectChange(item);
    };

    const resetState = (shouldClose?: boolean) => {
      setFocusIndex(defaultFocusIndex);
      setTmpValue();
      if (shouldClose || closeOnSelect) {
        setOpen(false);
        if (select) onChange();
      }
    };

    const traverse = (isForward: boolean) => {
      const baseIndex = rovingText ? -1 : 0;
      let newItem: T | undefined,
        newIndex = focusIndex,
        itemCounter = 0;
      const itemLength = items.length;
      for (;;) {
        if (isForward) {
          if (++newIndex >= itemLength) newIndex = baseIndex;
        } else {
          if (--newIndex < baseIndex) newIndex = itemLength - 1;
        }
        newItem = items[newIndex];
        if (!newItem || !isItemDisabled?.(newItem)) break;
        if (++itemCounter >= itemLength) return;
      }

      setFocusIndex(newIndex);
      if (rovingText) setTmpValue(getItemValue(newItem));
    };

    const focusCaptureProps: ReturnType<GetProps<T>["getFocusCaptureProps"]> = {
      onMouseDown: startCapture,
      onMouseUp: stopCapture,
    };

    return {
      isInputEmpty: !inputValue,

      getFocusCaptureProps: () => focusCaptureProps,

      getClearProps: () => ({
        ...buttonProps,
        ...focusCaptureProps,

        onClick: () => {
          setTmpValue();
          setFocusIndex(defaultFocusIndex);
          onChange("");
          if (deselectOnClear) onSelectChange();
        },
      }),

      getListProps: () => ({
        ...focusCaptureProps,
        id: listId,
        role: "listbox",
      }),

      getItemProps: ({ item, index }) => ({
        id: getId(id, index),
        role: "option",
        "aria-selected": select ? isItemSelected(item) : index === focusIndex,
        ref: index === focusIndex ? scrollIntoView : undefined,
        onClick: () => !isItemDisabled?.(item) && resetState(selectItemOrAction(item)),
        onPointerMove: () => !isItemDisabled?.(item) && setFocusIndex(index),
      }),

      getInputProps: () => ({
        type: "text",
        role: "combobox",
        autoComplete: "off",
        "aria-autocomplete": "list",
        "aria-expanded": open,
        "aria-controls": listId,
        "aria-activedescendant": focusIndex >= 0 ? getId(id, focusIndex) : undefined,
        ref: inputRef,
        value: inputValue,

        onChange: (e) => {
          setOpen(true);
          setFocusIndex(defaultFocusIndex);
          setTmpValue();

          const newValue = e.target.value;
          onChange(newValue);
          if ((!select && deselectOnChange) || (deselectOnClear && !newValue)) {
            onSelectChange();
          }
        },

        onBlur: () => {
          if (inCapture()) return;
          if (!select) onChange(inputValue);
          resetState(true);
        },

        onKeyDown: (e) => {
          switch (e.key) {
            case "ArrowUp":
            case "ArrowDown":
              // Prevent the caret (cursor) from moving within the text
              e.preventDefault();
              if (open) {
                traverse(e.key != "ArrowUp");
              } else {
                setOpen(true);
              }
              break;
            case "Enter":
              if (open) {
                if (focusItem) {
                  // Call preventDefault as we've already triggered on* events in this branch
                  e.preventDefault();
                  resetState(selectItemOrAction(focusItem));
                } else if (!select) {
                  resetState(true);
                }
              }
              break;
            case "Escape":
              if (open) {
                resetState(true);
              } else {
                onChange("");
                if (deselectOnClear) onSelectChange();
              }
            // intentionally removed break in the last case to save bytes
            // break;
          }
        },

        onMouseDown: (e) => e.stopPropagation(),
        onClick: () => setOpen(true),
      }),
    };
  };

export { type AutocompleteLiteFeature, autocompleteLite };
