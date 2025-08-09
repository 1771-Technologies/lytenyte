import { useSlot, type SlotComponent } from "@1771technologies/lytenyte-react-hooks";
import { forwardRef, type JSX } from "react";
import { useSortRowCtx } from "./context";
import type { Option } from "./+types";

export interface SortColumnSelectProps {
  readonly as?: SlotComponent<{
    options: Option[];
    onSelect: (v: Option | null) => void;
    value: Option | null;
  }>;
}

export const SortColumnSelect = forwardRef<
  HTMLSelectElement,
  JSX.IntrinsicElements["div"] & SortColumnSelectProps
>(function SortColumnSelect({ as, ...props }, forwarded) {
  const row = useSortRowCtx();

  const el = (
    <select
      aria-label="Select column to sort"
      value={row.columnItem?.value ?? ""}
      onChange={(e) => {
        const item = row.columnOptions.find((c) => c.value === e.target.value);

        row.columnOnSelect(item ?? null);
      }}
    >
      <option value="">Select...</option>
      {row.columnOptions.map((c) => {
        return (
          <option key={c.value} value={c.value}>
            {c.label}
          </option>
        );
      })}
    </select>
  );

  const renderer = useSlot({
    props: [props],
    ref: forwarded,
    slot: as ?? el,
    state: { options: row.columnOptions, onSelect: row.columnOnSelect, value: row.columnSelected },
  });

  return renderer;
});
