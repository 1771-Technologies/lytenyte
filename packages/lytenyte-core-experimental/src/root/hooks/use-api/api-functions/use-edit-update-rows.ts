import type { RowNode, RowSource } from "@1771technologies/lytenyte-shared";
import { useEvent } from "../../../../hooks/use-event.js";
import type { Root } from "../../../root.js";

export function useEditUpdateRows(
  props: Root.Props,
  api: Root.API,
  source: RowSource,
): Root.API["editUpdateRows"] {
  return useEvent((param) => {
    const updateMap = new Map<RowNode<any>, any>();

    const errors = new Map<number | string, boolean | Record<string, unknown>>();

    const validator = props.editRowValidatorFn as Root.Props["editRowValidatorFn"];
    for (const [key, data] of param) {
      const row = typeof key === "number" ? api.rowByIndex(key).get() : api.rowById(key);

      if (!row) {
        errors.set(key, false);
        continue;
      }

      if (validator) {
        const valid = validator({ api, editData: data, row });
        if (!valid) {
          errors.set(key, valid);
          continue;
        }
      }
      updateMap.set(row, data);
    }

    if (errors.size) return errors;

    source.onRowsUpdated(updateMap);
    return true;
  });
}
