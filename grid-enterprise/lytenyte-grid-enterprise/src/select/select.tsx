import { clsx } from "@1771technologies/js-utils";
import "./select.css";
import { ArrowDownIcon } from "@1771technologies/lytenyte-grid-community/icons";
import { CheckMark } from "@1771technologies/lytenyte-grid-community/internal";
import { Select as S } from "@base-ui-components/react/select";

export interface SelectProps {
  readonly selected: { value: string; label: string } | null;
  readonly options: { value: string; label: string }[];
  readonly onSelect: (c: { value: string; label: string }) => void;

  readonly placeholder?: string;
}

export function Select({ selected, onSelect, options, placeholder }: SelectProps) {
  return (
    <S.Root
      value={selected?.value ?? null}
      onValueChange={(v) => {
        const opt = options.find((c) => c.value === v);
        if (!opt) return;
        onSelect(opt);
      }}
    >
      <S.Trigger className="lng1771-select">
        <S.Value
          className={clsx("lng1771-select__value", !selected && "lng1771-select__value--no-value")}
          placeholder={placeholder}
        ></S.Value>
        <S.Icon className="lng1771-select__trigger">
          <ArrowDownIcon />
        </S.Icon>
      </S.Trigger>
      <S.Portal>
        <S.Positioner sideOffset={20}>
          <S.Popup className="lng1771-select__popup">
            {options.map((c) => {
              return (
                <S.Item key={c.value} value={c.value} className="lng1771-select__item">
                  <S.ItemText className="lng1771-select__item-text">{c.label}</S.ItemText>
                  <S.ItemIndicator className="lng1771-select__item-indicator">
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
