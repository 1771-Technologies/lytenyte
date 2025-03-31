import "./dropdown.css";

import { dropdown, useCombobox } from "@1771technologies/react-autocomplete";
import { useMemo, useRef, useState, type CSSProperties, type RefObject } from "react";
import { clsx } from "@1771technologies/js-utils";
import { Input } from "@1771technologies/lytenyte-grid-community/internal";
import { SearchIcon } from "@1771technologies/lytenyte-grid-community/icons";
import { useCombinedRefs } from "@1771technologies/react-utils";
import { Popover as P } from "@base-ui-components/react/popover";

export interface DropdownProps<T extends { label: string; value: unknown }> {
  readonly items: T[];
  readonly placeholder?: string;
  readonly selected: T | null;
  readonly onSelect: (v: T | null) => void;

  readonly searchable?: boolean;

  readonly style?: CSSProperties;
  readonly dropdownRef?: RefObject<HTMLElement | null>;
}

const noop = () => {};
export function Dropdown<T extends { label: string; value: unknown }>({
  items,
  placeholder,
  selected,
  onSelect,
  searchable = false,
  style,
  dropdownRef,
}: DropdownProps<T>) {
  const { options, labelToItem } = useMemo(() => {
    const options = items.map((c) => c.label);
    const labelToItem = new Map(items.map((c) => [c.label, c]));

    return { options, labelToItem };
  }, [items]);

  const [value, setValue] = useState<string>();

  const filteredOptions = useMemo(() => {
    if (!value) return options.toSorted();

    return options.filter((c) => c.toLocaleLowerCase().includes(value.toLocaleLowerCase())).sort();
  }, [options, value]);

  const label = useMemo(() => {
    if (selected == null) return "";

    return selected.label;
  }, [selected]);

  const {
    getToggleProps,
    getInputProps,
    getItemProps,
    getListProps,
    open,
    setOpen,
    focusIndex,
    toggleRef,
  } = useCombobox({
    items: filteredOptions,
    value: searchable ? value : label,
    onChange: searchable ? setValue : noop,

    selected: label,
    onSelectChange: (v) => {
      if (!v) return;

      const value = labelToItem.get(v);
      onSelect(value ?? null);
    },

    flipOnSelect: true,
    feature: dropdown({
      closeOnSelect: true,
      rovingText: false,
    }),
  });

  console.log(focusIndex);

  const ref = useRef<HTMLDivElement>(null);

  const refForPlacement = searchable ? toggleRef : ref;

  const combined = useCombinedRefs(dropdownRef, ref);

  return (
    <div style={{ position: "relative" }}>
      {!searchable && (
        <div className="lng1771-dropdown" ref={combined} style={style}>
          <button className="lng1771-dropdown-searchable" {...getToggleProps()}>
            {selected?.label && (
              <span className="lng1771-dropdown-searchable__label">{selected.label}</span>
            )}
            {!selected && (
              <span className="lng1771-dropdown-searchable__placeholder">{placeholder ?? ""}</span>
            )}
            <span className="lng1771-dropdown__chevron">›</span>
          </button>
        </div>
      )}
      {searchable && (
        <button className="lng1771-dropdown-searchable" {...getToggleProps()} style={style}>
          {selected?.label && (
            <span className="lng1771-dropdown-searchable__label">{selected.label}</span>
          )}
          {!selected && (
            <span className="lng1771-dropdown-searchable__placeholder">{placeholder ?? ""}</span>
          )}
          <span className="lng1771-dropdown__chevron">›</span>
        </button>
      )}
      {open && refForPlacement.current && (
        <P.Root open onOpenChange={() => setOpen(false)}>
          <P.Portal>
            <P.Positioner anchor={refForPlacement.current as HTMLElement} sideOffset={8}>
              <P.Popup
                className="lng1771-popover"
                {...getListProps()}
                style={{ width: refForPlacement.current.offsetWidth }}
              >
                {!searchable && (
                  <input
                    className="lng1771-dropdown__input"
                    readOnly
                    placeholder={placeholder}
                    {...getInputProps()}
                    style={{ display: "none" }}
                  />
                )}

                {searchable && (
                  <div>
                    <Input {...getInputProps()} icon={SearchIcon} />
                  </div>
                )}
                <ul
                  className={clsx(
                    "lng1771-dropdown__list",
                    searchable && "lng1771-dropdown__list--searchable",
                  )}
                >
                  {filteredOptions.map((c, i) => {
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
              </P.Popup>
            </P.Positioner>
          </P.Portal>
        </P.Root>
      )}
    </div>
  );
}
