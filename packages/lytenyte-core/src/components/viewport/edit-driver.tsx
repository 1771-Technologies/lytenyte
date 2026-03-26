import { useEffect } from "react";
import { useEdit, useRoot } from "../../root/root-context.js";
import { usePosition } from "../../root/contexts/position-context.js";

export function EditDriver() {
  const { editMode, api } = useRoot();
  const edit = useEdit();

  const focus = usePosition().get();
  const activeEdit = edit.activeEdit;

  useEffect(() => {
    if (editMode === "readonly" || !focus || !activeEdit) return;

    if (focus.kind !== "cell") {
      edit.commit();
      return;
    }

    if (editMode === "row") {
      const row = api.rowByIndex(focus.rowIndex).get();
      if (!row || row.id !== activeEdit.rowId) {
        edit.commit();
        return;
      }
    } else {
      const row = api.rowByIndex(focus.rowIndex).get();
      const col = api.columnByIndex(focus.colIndex);

      if (!row || row.id !== activeEdit.rowId || !col || activeEdit.column !== col?.id) {
        edit.commit();
        return;
      }
    }
  }, [activeEdit, api, edit, editMode, focus]);

  return <></>;
}
