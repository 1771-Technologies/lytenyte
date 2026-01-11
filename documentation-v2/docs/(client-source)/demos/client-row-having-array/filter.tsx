import type { Grid } from "@1771technologies/lytenyte-pro-experimental";
import { Menu } from "@1771technologies/lytenyte-pro-experimental";
import type { FilterModel, GridSpec } from "./demo.jsx";
import { NumberInput } from "./number-input.jsx";

export function FloatingFilter({ api, column }: Grid.T.HeaderParams<GridSpec>) {
  const model = api.filterModel.useValue();

  const filter = model[column.id];

  const kind = filter?.kind ?? "gt";

  return (
    <div className="grid h-full w-full grid-cols-[auto_1fr] items-center">
      <Menu>
        <Menu.Trigger data-ln-button="tertiary" data-ln-size="xs" data-ln-icon className="rounded-none">
          <span className="sr-only">Select your filter operation</span>
          {kind === "lt" && <span className="iconify ph--less-than size-4"></span>}
          {kind === "gt" && <span className="iconify ph--greater-than size-4"></span>}
          {kind === "le" && <span className="iconify ph--less-than-or-equal size-4"></span>}
          {kind === "ge" && <span className="iconify ph--greater-than-or-equal size-4"></span>}
          {kind === "eq" && <span className="iconify ph--equals size-4"></span>}
          {kind === "neq" && <span className="iconify ph--not-equals size-4"></span>}
        </Menu.Trigger>
        <Menu.Popover>
          <Menu.Arrow />
          <Menu.Container>
            <Menu.RadioGroup
              value={kind}
              onChange={(x) => {
                api.filterModel.set((prev) => {
                  const next = { ...prev };
                  if (next[column.id])
                    next[column.id] = { ...next[column.id], kind: x as FilterModel[string]["kind"] };
                  else next[column.id] = { kind: x as FilterModel[string]["kind"], value: null };

                  return next;
                });
              }}
            >
              <Menu.RadioItem value="lt">
                <span className="iconify ph--less-than size-4"></span>
              </Menu.RadioItem>
              <Menu.RadioItem value="gt">
                <span className="iconify ph--greater-than size-4"></span>
              </Menu.RadioItem>
              <Menu.RadioItem value="le">
                <span className="iconify ph--less-than-or-equal size-4"></span>
              </Menu.RadioItem>
              <Menu.RadioItem value="ge">
                <span className="iconify ph--greater-than-or-equal size-4"></span>
              </Menu.RadioItem>
              <Menu.RadioItem value="eq">
                <span className="iconify ph--equals size-4"></span>
              </Menu.RadioItem>
              <Menu.RadioItem value="neq">
                <span className="iconify ph--not-equals size-4"></span>
              </Menu.RadioItem>
            </Menu.RadioGroup>
          </Menu.Container>
        </Menu.Popover>
      </Menu>
      <NumberInput
        value={filter?.value ?? ""}
        onChange={(e) => {
          api.filterModel.set((prev) => {
            const next = { ...prev };
            const value = e.target.value;
            next[column.id] = { kind, value: value };

            return next;
          });
        }}
      />
    </div>
  );
}
