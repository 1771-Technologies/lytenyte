import { forwardRef, memo, type JSX, type ReactNode } from "react";
import { useSlot, type SlotComponent } from "../../hooks/use-slot/index.js";
import type { PillRowSpec, PillState } from "./types.js";
import { usePillRow } from "./pill-row.context.js";
import { ColumnPivots, Columns, Icon, RowGroups, RowPivots } from "./icons.js";

const typeToIcon: Record<string, (props: JSX.IntrinsicElements["svg"]) => ReactNode> = {
  columns: Columns,
  "row-groups": RowGroups,
  "row-pivots": RowPivots,
  "column-pivots": ColumnPivots,
};

function PillBase({ render, ...props }: PillLabel.Props, forwarded: PillLabel.Props["ref"]) {
  const { expandToggle, expanded, row } = usePillRow();

  const I = row.type ? typeToIcon[row.type] : null;

  const s = render ?? (
    <div data-ln-pill-label>
      {I && (
        <Icon>
          <I />
        </Icon>
      )}

      <div data-ln-pill-label-text>{row.label}</div>
    </div>
  );

  const slot = useSlot({
    props: [props],
    ref: forwarded,
    slot: s,
    state: {
      expanded,
      expandToggle,
      row,
    } satisfies PillState,
  });

  if (row.label == null) return null;
  return slot;
}

export const PillLabel = memo(forwardRef(PillBase));

export namespace PillLabel {
  export type Props = Omit<JSX.IntrinsicElements["div"], "children"> & {
    row: PillRowSpec;
    render?: SlotComponent<PillState>;
  };
}
