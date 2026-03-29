import { useEffect } from "react";
import { useFocusReactive } from "../../root/contexts/focus-position.js";
import { useRoot } from "../../root/root-context.js";
import { useEditContext } from "../../root/contexts/edit-context.js";
import { useAPI } from "../../root/contexts/api-provider.js";

export function EditDriver() {
  const { editMode } = useRoot();
  const edit = useEditContext();
  const api = useAPI();

  const [focus] = useFocusReactive();
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
