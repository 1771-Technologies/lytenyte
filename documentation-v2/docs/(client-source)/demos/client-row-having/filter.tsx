import type { Grid } from "@1771technologies/lytenyte-pro";
import type { FilterModel, GridSpec } from "./demo";
import { NumberInput } from "./number-input.js";
import { Menu } from "@1771technologies/lytenyte-pro/components";

export function FloatingFilter({ api, column }: Grid.T.HeaderParams<GridSpec>) {
  const model = api.filterModel.useValue();

  const filter = model[column.id];

  const kind = filter?.kind ?? "gt";

  return (
    <div className="grid h-full w-full grid-cols-[auto_1fr] items-center gap-2">
      <NumberInput
        className="px-2"
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

      <Menu>
        <Menu.Trigger
          data-ln-button="secondary"
          data-ln-size="xs"
          data-ln-icon
          className="relative rounded-none"
        >
          <span className="sr-only">Select your filter operation</span>
          {kind === "lt" && <span className="iconify ph--less-than size-4"></span>}
          {kind === "gt" && <span className="iconify ph--greater-than size-4"></span>}
          {kind === "le" && <span className="iconify ph--less-than-or-equal size-4"></span>}
          {kind === "ge" && <span className="iconify ph--greater-than-or-equal size-4"></span>}
          {kind === "eq" && <span className="iconify ph--equals size-4"></span>}
          {kind === "neq" && <span className="iconify ph--not-equals size-4"></span>}
          {filter?.value && <div className="bg-ln-primary-50 absolute -right-1 -top-1 size-2 rounded-full" />}
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
              <Menu.RadioItem value="lt" className="flex items-center gap-2">
                <span className="iconify ph--less-than size-4"></span>
                Less Than
              </Menu.RadioItem>
              <Menu.RadioItem value="gt" className="flex items-center gap-2">
                <span className="iconify ph--greater-than size-4"></span>
                Greater Than
              </Menu.RadioItem>
              <Menu.RadioItem value="le" className="flex items-center gap-2">
                <span className="iconify ph--less-than-or-equal size-4"></span>
                Less Than Or Equal To
              </Menu.RadioItem>
              <Menu.RadioItem value="ge" className="flex items-center gap-2">
                <span className="iconify ph--greater-than-or-equal size-4"></span>
                Greater Than Or Equal To
              </Menu.RadioItem>
              <Menu.RadioItem value="eq" className="flex items-center gap-2">
                <span className="iconify ph--equals size-4"></span>
                Equal To
              </Menu.RadioItem>
              <Menu.RadioItem value="neq" className="flex items-center gap-2">
                <span className="iconify ph--not-equals size-4"></span>
                Not Equal To
              </Menu.RadioItem>
            </Menu.RadioGroup>
          </Menu.Container>
        </Menu.Popover>
      </Menu>
    </div>
  );
}
