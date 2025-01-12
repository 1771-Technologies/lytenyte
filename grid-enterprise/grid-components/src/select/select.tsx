import { ListView, type ListViewItemRendererProps } from "@1771technologies/react-list-view";
import { useMemo, useRef, useState } from "react";
import { LngPopover } from "../popover/lng-popover";
import { t } from "@1771technologies/grid-design";
import { clsx } from "@1771technologies/js-utils";

export interface SelectItem {
  readonly label: string;
  readonly value: string;
}

export interface SelectProps {
  readonly items: SelectItem[];
  readonly onSelect: (s: SelectItem) => void;
  readonly value: SelectItem | null;
  readonly placeholder?: string;
}

const expansions = {};
const onExpansionChange = () => {};

export function Select({ items, value, onSelect, placeholder }: SelectProps) {
  const [open, setOpen] = useState(false);
  const paths = useMemo(() => {
    return items.map((c) => ({ path: [], data: { ...c, isSelected: c.value === value?.value } }));
  }, [items, value?.value]);

  const scrollIndex = useMemo(() => {
    const index = paths.findIndex((c) => c.data.isSelected);

    return index === -1 ? undefined : index;
  }, [paths]);

  const ref = useRef<HTMLButtonElement | null>(null);

  return (
    <>
      <button
        ref={ref}
        onClick={() => setOpen(true)}
        onKeyDown={(ev) => {
          if (ev.key === "ArrowDown") {
            ev.preventDefault();
            setOpen(true);
          }
        }}
        className={clsx(
          css`
            min-width: 120px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0;
            border: none;
            background-color: ${t.colors.backgrounds_form_field};
            border: 1px solid transparent;
            box-sizing: border-box;
            box-shadow:
              0px 1.5px 2px 0px var(--lng1771-borders-field-and-button-shadow),
              0px 0px 0px 1px var(--lng1771-borders-field-and-button);
            border-radius: ${t.spacing.field_radius_small};
            padding-inline: ${t.spacing.space_25};
            height: ${t.spacing.input_height};

            &:focus {
              outline: none;
              border-color: ${t.colors.borders_focus};
              box-shadow: 0px 0px 0px 2px ${t.colors.borders_focus_shadow};
              background-color: ${t.colors.backgrounds_form_field_focus};
            }
          `,
          open &&
            css`
              border: 1px solid ${t.colors.primary_30};
            `,
        )}
      >
        {value && <span className="lng1771-text-medium">{value.label}</span>}
        {!value && <span className="lng1771-text-small-300">{placeholder ?? ""} </span>}
        <span
          className={css`
            position: relative;
            top: 1px;
            transform: rotate(90deg);
            color: ${t.colors.borders_icons_default};
            font-size: 16px;
          `}
        >
          ›
        </span>
      </button>
      {ref.current && (
        <LngPopover
          open={open}
          onOpenChange={setOpen}
          popoverTarget={ref.current}
          className={css`
            padding-inline-end: 0px;
          `}
        >
          <div
            style={{ height: Math.min(items.length * 36, 400) }}
            className={css`
              max-height: 500px;
              min-width: 120px;
              width: var(--lng-reference-width);
              max-width: 350px;
            `}
          >
            <ListView<SelectItem & { isSelected: boolean }>
              expansions={expansions}
              onExpansionChange={onExpansionChange}
              scrollIntoViewIndex={scrollIndex}
              className={css`
                scrollbar-width: thin;
                &:focus {
                  outline: none;
                }
              `}
              itemClassName={css`
                &:focus {
                  outline: none;
                }
                padding-inline-end: ${t.spacing.space_05};

                &:focus div:not(:hover) {
                  background-color: ${t.colors.backgrounds_light};
                }
              `}
              itemHeight={36}
              axe={{
                axeDescription: "",
                axeItemLabels: () => "",
                axeLabel: () => "",
              }}
              onAction={(s) => {
                void (s.type === "leaf" && onSelect(s.data));
                setOpen(false);
              }}
              paths={paths}
              renderer={SelectRenderer}
            />
          </div>
        </LngPopover>
      )}
    </>
  );
}

function SelectRenderer(props: ListViewItemRendererProps<SelectItem & { isSelected: boolean }>) {
  const data = props.data;
  if (data.type === "parent") return;

  return (
    <div
      className={clsx(
        "lng1771-text-medium",
        css`
          padding-inline-start: ${t.spacing.space_25};
          padding-inline-end: ${t.spacing.space_20};
          padding-block: ${t.spacing.space_20};
          max-width: 100%;
          overflow: hidden;
          display: grid;
          grid-template-columns: 1fr 24px;

          border-radius: ${t.spacing.box_radius_medium};

          &:hover {
            background-color: ${t.colors.backgrounds_default};
          }
        `,
      )}
    >
      <span
        className={css`
          width: 100%;

          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
        `}
      >
        {data.data.label}
      </span>
      {data.data.isSelected && (
        <span
          className={css`
            color: ${t.colors.primary_50};
            font-weight: 600;
          `}
        >
          ✓
        </span>
      )}
    </div>
  );
}
