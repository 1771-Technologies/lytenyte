import { Menu } from "../menu/menu.js";
import type { ColumnProReact, GridProReact } from "../types.js";

export interface PillManagerAggMenuProps<D> {
  grid: GridProReact<D>;
  column: ColumnProReact<D>;
}

export function PillManagerAggMenu<D>({ column, grid }: PillManagerAggMenuProps<D>) {
  const base = grid.state.columnBase.use();
  const aggModel = grid.state.aggModel.use();

  const agg = aggModel[column.id]?.fn;

  let allowed = column.aggFnsAllowed ?? base.aggFnsAllowed ?? [];

  if (typeof agg === "function") allowed = ["Fn(x)", ...allowed];
  else if (typeof agg === "string" && !allowed.includes(agg)) allowed = [agg, ...allowed];

  return (
    <Menu.Container>
      <Menu.RadioGroup
        value={typeof agg === "function" ? "Fn(x)" : (agg ?? "")}
        onValueChange={(v) => {
          if (v === "Fn(x)") return;

          const next = { ...aggModel };
          next[column.id].fn = v;

          grid.state.aggModel.set(next);
        }}
      >
        {allowed.map((c) => {
          return (
            <Menu.Radio key={c} value={c} closeOnClick>
              {c}
              <Menu.RadioIndicator />
            </Menu.Radio>
          );
        })}
      </Menu.RadioGroup>
    </Menu.Container>
  );
}

export function PillManagerMeasureMenu<D>({ column, grid }: PillManagerAggMenuProps<D>) {
  const base = grid.state.columnBase.use();
  const measureModel = grid.state.measureModel.use();

  const agg = measureModel[column.id].fn;

  let allowed = column.measureFnsAllowed ?? base.measureFnsAllowed ?? [];

  if (typeof agg === "function") allowed = ["Fn(x)", ...allowed];
  else if (typeof agg === "string" && !allowed.includes(agg)) allowed = [agg, ...allowed];

  return (
    <Menu.Container>
      <Menu.RadioGroup
        value={typeof agg === "function" ? "Fn(x)" : (agg ?? "")}
        onValueChange={(v) => {
          if (v === "Fn(x)") return;

          const next = { ...measureModel };
          next[column.id].fn = v;

          grid.state.measureModel.set(next);
        }}
      >
        {allowed.map((c) => {
          return (
            <Menu.Radio key={c} value={c} closeOnClick>
              {c}
              <Menu.RadioIndicator />
            </Menu.Radio>
          );
        })}
      </Menu.RadioGroup>
    </Menu.Container>
  );
}
