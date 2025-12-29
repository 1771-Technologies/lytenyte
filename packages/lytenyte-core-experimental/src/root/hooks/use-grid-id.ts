import { useId } from "react";

export function useGridId(providedId: string | undefined) {
  const id = useId();
  const gridId = providedId ?? id;

  return gridId;
}
