import { useMemo } from "react";
import { useSlot, type SlotComponent } from "../hooks/use-slot/index.js";
import type { API, GridSpec } from "../types";
import { useEvent } from "@1771technologies/lytenyte-core-experimental/internal";

export interface SelectAllProps {
  readonly slot?: SlotComponent<{
    readonly indeterminate: boolean;
    readonly selected: boolean;
    readonly toggle: (forceState?: boolean) => void;
  }>;
}

export function SelectAll<Spec extends GridSpec>({
  api,
  slot,
}: SelectAllProps & { readonly api: API<Spec> }) {
  const s = api.useSelectionState();

  const selected = useMemo(() => {
    const selected =
      s.kind === "isolated" ? s.selected && s.exceptions.size === 0 : s.selected && s.children.size === 0;

    return selected;
  }, [s]);

  const indeterminate = useMemo(() => {
    if (s.kind === "isolated") return !!s.exceptions.size;

    return Boolean(s.children.size);
  }, [s]);

  const toggle = useEvent((b?: boolean) => {
    if (b != null) return api.rowSelect({ selected: "all", deselect: !b });

    api.rowSelect({ selected: "all", deselect: selected });
  });

  const rendered = useSlot({
    slot: slot ?? (
      <input
        aria-label="Toggle the selection for all the rows in the grid."
        ref={(x) => {
          if (!x) return;
          x.indeterminate = indeterminate;
        }}
        type="checkbox"
        checked={selected}
        onChange={() => toggle()}
      />
    ),
    state: {
      selected,
      indeterminate,
      toggle,
    },
  });

  return rendered;
}
