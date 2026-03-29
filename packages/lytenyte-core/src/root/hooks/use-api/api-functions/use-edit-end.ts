import { useEvent } from "../../../../hooks/use-event.js";
import type { EditContext } from "../../../contexts/edit-context.js";
import type { Root } from "../../../root.js";

export function useEditEnd(edit: EditContext): Root.API["editEnd"] {
  return useEvent((cancel) => {
    if (cancel) {
      edit.cancel();
      return true;
    }
    return edit.commit();
  });
}
