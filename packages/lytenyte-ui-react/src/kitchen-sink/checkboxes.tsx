import { Checkbox } from "../components/checkbox/index.js";

export function Checkboxes() {
  return (
    <div className="flex items-center gap-8">
      <Checkbox.Root>
        <label className="flex items-center gap-2">
          Checkbox
          <Checkbox.Container>
            <Checkbox.Input />
            <Checkbox.Checkmark />
          </Checkbox.Container>
        </label>
      </Checkbox.Root>

      <Checkbox.Root indeterminate>
        <label className="flex items-center gap-2">
          Indeterminate
          <Checkbox.Container>
            <Checkbox.Input />
            <Checkbox.Checkmark />
          </Checkbox.Container>
        </label>
      </Checkbox.Root>

      <Checkbox.Root checked>
        <label className="flex items-center gap-2">
          Checked
          <Checkbox.Container>
            <Checkbox.Input />
            <Checkbox.Checkmark />
          </Checkbox.Container>
        </label>
      </Checkbox.Root>
    </div>
  );
}
