import { ListView, type ListViewItemRendererProps } from "@1771technologies/react-list-view";
import { useMemo, useRef, useState } from "react";
import { LngPopover } from "../popover/lng-popover";

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
    return items.map((c) => ({ path: [], data: c }));
  }, [items]);

  const ref = useRef<HTMLButtonElement | null>(null);

  return (
    <>
      <button
        ref={ref}
        onClick={() => setOpen(true)}
        className={css`
          min-width: 120px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0;
          border: none;
          background-color: transparent;
        `}
      >
        <span>{value?.label ?? placeholder ?? ""}</span>
        <span>⌵</span>
      </button>
      {ref.current && (
        <LngPopover open={open} onOpenChange={setOpen} popoverTarget={ref.current}>
          <div
            className={css`
              min-height: 200px;
              max-height: 400px;
              min-width: 200px;
              max-width: 250px;
            `}
          >
            <ListView<SelectItem>
              expansions={expansions}
              onExpansionChange={onExpansionChange}
              axe={{
                axeDescription: "",
                axeItemLabels: () => "",
                axeLabel: () => "",
              }}
              onAction={(s) => s.type === "leaf" && onSelect(s.data)}
              paths={paths}
              renderer={SelectRenderer}
            />
          </div>
        </LngPopover>
      )}
    </>
  );
}

function SelectRenderer(props: ListViewItemRendererProps<SelectItem>) {
  const data = props.data;
  if (data.type === "parent") return;

  return <div>{data.data.label}</div>;
}
