import { useSlot, type SlotComponent } from "@1771technologies/lytenyte-react-hooks";
import { forwardRef, type JSX } from "react";
import { useSortRowCtx } from "./context.js";
import type { Option } from "./+types";

export interface SortDirectionSelectProps {
  readonly as?: SlotComponent<{
    options: Option[];
    onSelect: (v: Option | null) => void;
    value: Option | null;
  }>;
}

export const SortDirectionSelect = forwardRef<
  HTMLSelectElement,
  JSX.IntrinsicElements["div"] & SortDirectionSelectProps
>(function SortDirectionSelect({ as, ...props }, forwarded) {
  const row = useSortRowCtx();

  const el = (
    <select
      aria-label="Select sort direction"
      value={row.sortDirectionSelected?.value ?? ""}
      onChange={(e) => {
        const item = row.sortDirectionOptions.find((c) => c.value === e.target.value);
        row.sortDirectionOnSelect(item ?? null);
      }}
    >
      {row.sortDirectionOptions.map((c) => {
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
      options: row.sortDirectionOptions,
      onSelect: row.sortDirectionOnSelect,
      value: row.sortDirectionSelected,
    },
  });

  return renderer;
});
