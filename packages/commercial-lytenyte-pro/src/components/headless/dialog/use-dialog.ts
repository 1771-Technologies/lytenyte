import { useMemo } from "react";
import { useDialogRoot } from "./context.js";

export function useDialog() {
  const { open, onOpenChange } = useDialogRoot();

  const api = useMemo(() => {
    return {
      open,
      openChange: (b: boolean) => onOpenChange(b),
    };
  }, [onOpenChange, open]);

  return api;
}
