import "./dropdown.css";

import { dropdown, useCombobox } from "@1771technologies/react-autocomplete";
import { useMemo, useRef } from "react";
import { Portal } from "../portal";
import { clsx } from "@1771technologies/js-utils";

export interface DropdownProps<T extends { label: string; value: unknown }> {
  readonly items: T[];
  readonly placeholder?: string;
  readonly selected: T | null;
  readonly onSelect: (v: T | null) => void;
}

const noop = () => {};
export function Dropdown<T extends { label: string; value: unknown }>({
  items,
  placeholder,
  selected,
  onSelect,
}: DropdownProps<T>) {
  const { options, labelToItem } = useMemo(() => {
    const options = items.map((c) => c.label);
    const labelToItem = new Map(items.map((c) => [c.label, c]));

    return { options, labelToItem };
  }, [items]);

  const label = useMemo(() => {
    if (selected == null) return "";

    return selected.label;
  }, [selected]);

  const { getToggleProps, getInputProps, getItemProps, getListProps, open, focusIndex } =
    useCombobox({
      items: options,
      value: label,
      onChange: noop,

      selected: label,
      onSelectChange: (v) => {
        if (!v) return onSelect(null);

        const value = labelToItem.get(v);
        onSelect(value ?? null);
      },

      flipOnSelect: true,
      feature: dropdown({
        closeOnSelect: true,
        rovingText: false,
      }),
    });

  const toggleProps = getToggleProps();
  const ref = useRef<HTMLDivElement>(null);

  return (
    <>
      <div className="lng1771-dropdown" ref={ref}>
        <input
          className="lng1771-dropdown__input"
          readOnly
          placeholder={placeholder}
          {...getInputProps()}
        />
        <button className="lng1771-dropdown__chevron" {...toggleProps} tabIndex={-1}>
          ›
        </button>
      </div>
      {open && ref.current && (
        <Portal
          portalTarget={ref.current}
          matchWidth
          {...getListProps()}
          style={{ minWidth: 120 }}
          className="lng1771-dropdown__list-container"
        >
          <ul className="lng1771-dropdown__list">
            {options.map((c, i) => {
              return (
                <li
                  key={c}
                  {...getItemProps({ item: c, index: i })}
                  className={clsx(
                    "lng1771-dropdown__list-item",
                    focusIndex === i && "lng1771-dropdown__list-item--focused",
                  )}
                >
                  <span>{c}</span>
                  {selected?.label === c && (
                    <span className="lng1771-dropdown__list-item--select-icon">✓</span>
                  )}
                </li>
              );
            })}
          </ul>
        </Portal>
      )}
    </>
  );
}
