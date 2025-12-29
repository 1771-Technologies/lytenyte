import { useMemo } from "react";
import type { Root } from "../root";

export function useDropAccept(props: Root.Props, gridId: string) {
  const dropAccept = useMemo(() => {
    const drop = props.rowDropAccept ?? [];
    if (!drop.includes(gridId)) drop.push(gridId);

    return drop.map((x) => `grid:${x}`);
  }, [gridId, props.rowDropAccept]);

  return dropAccept;
}
