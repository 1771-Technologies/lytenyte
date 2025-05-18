import { clsx } from "@1771technologies/js-utils";
import "./select.css";
import { ArrowDownIcon } from "@1771technologies/lytenyte-core/icons";
import { CheckMark } from "@1771technologies/lytenyte-core/internal";
import { Select as S } from "@base-ui-components/react/select";
import type { JSX } from "react";

export interface SelectClassNames {
  readonly triggerClassName?: string;
  readonly triggerValueClassName?: string;
  readonly triggerIconClassName?: string;
  readonly popupClassName?: string;
  readonly itemClassName?: string;
  readonly itemIndicatorClassName?: string;
  readonly itemTextClassName?: string;
}

export interface SelectProps {
  readonly selected: { value: string; label: string } | null;
  readonly options: { value: string; label: string }[];
  readonly onSelect: (c: { value: string; label: string }) => void;

  readonly placeholder?: string;
}

export function Select({
  selected,
  onSelect,
  options,
  placeholder,

  triggerClassName,
  triggerValueClassName,
  triggerIconClassName,
  popupClassName,
  itemClassName,
  itemIndicatorClassName,
  itemTextClassName,

  ...props
}: SelectProps & SelectClassNames & Omit<JSX.IntrinsicElements["div"], "onSelect">) {
  return (
    <S.Root
      value={selected?.value ?? null}
      onValueChange={(v) => {
        const opt = options.find((c) => c.value === v);
        if (!opt) return;
        onSelect(opt);
      }}
      alignItemToTrigger={false}
    >
      <S.Trigger {...props} className={clsx("lng1771-select", triggerClassName)}>
        <S.Value
          className={clsx(
            "lng1771-select__value",
            !selected && "lng1771-select__value--no-value",
            triggerValueClassName,
          )}
          placeholder={placeholder}
        ></S.Value>
        <S.Icon className={clsx("lng1771-select__trigger", triggerIconClassName)}>
          <ArrowDownIcon />
        </S.Icon>
      </S.Trigger>
      <S.Portal>
        <S.Positioner sideOffset={8} className="lng1771-select__positioner">
          <S.Popup className={clsx("lng1771-select__popup", popupClassName)}>
            {options.map((c) => {
              return (
                <S.Item
                  key={c.value}
                  value={c.value}
                  className={clsx("lng1771-select__item", itemClassName)}
                >
                  <S.ItemText className={clsx("lng1771-select__item-text", itemIndicatorClassName)}>
                    {c.label}
                  </S.ItemText>
                  <S.ItemIndicator
                    className={clsx("lng1771-select__item-indicator", itemTextClassName)}
                  >
                    <CheckMark />
                  </S.ItemIndicator>
                </S.Item>
              );
            })}
          </S.Popup>
        </S.Positioner>
      </S.Portal>
    </S.Root>
  );
}
