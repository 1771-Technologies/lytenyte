import { PillContainer } from "./container.js";
import { PillRowExpander } from "./expander.js";
import { PillItem } from "./item.js";
import { PillLabel } from "./label.js";
import { PillRow } from "./pill-row.js";
import type { PillRootContext } from "./root.context.js";
import type { PillRowSpec } from "./types.js";

export function PillRowDefault(row: PillRowSpec, ctx: PillRootContext) {
  const orientation = ctx.orientation;
  return (
    // Label
    <PillRow row={row}>
      <PillLabel row={row} />
      <PillContainer>
        {row.pills.map((x) => {
          return <PillItem item={x} key={x.id} />;
        })}
      </PillContainer>
      {orientation === "horizontal" && <PillRowExpander />}
    </PillRow>
  );
}
