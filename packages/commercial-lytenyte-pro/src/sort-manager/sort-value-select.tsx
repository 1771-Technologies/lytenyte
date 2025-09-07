import { useSlot, type SlotComponent } from "@1771technologies/lytenyte-react-hooks";
import { forwardRef, type JSX } from "react";
import { useSortRowCtx } from "./context.js";
import type { Option } from "./+types";

export interface SortValueSelectProps {
  readonly as?: SlotComponent<{
    options: Option[];
    onSelect: (v: Option | null) => void;
    value: Option | null;
    disabled: boolean;
  }>;
}

export const SortValueSelect = forwardRef<
  HTMLSelectElement,
  JSX.IntrinsicElements["div"] & SortValueSelectProps
>(function SortValueSelect({ as, ...props }, forwarded) {
  const row = useSortRowCtx();

  const el = (
    <select
      aria-label="Select sort value"
      value={row.sortSelected?.value ?? ""}
      onChange={(e) => {
        const item = row.sortOptions.find((c) => c.value === e.target.value);
        row.sortOnSelect(item ?? null);
      }}
      disabled={!row.sortOptions.length}
    >
      <option value="">Select...</option>
      {row.sortOptions.map((c) => {
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
    state: {
      options: row.sortOptions,
      value: row.sortSelected,
      onSelect: row.sortOnSelect,
      disabled: !row.sortOptions.length,
    },
  });

  return renderer;
});
