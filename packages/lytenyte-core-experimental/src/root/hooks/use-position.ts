import type { PositionUnion } from "@1771technologies/lytenyte-shared";
import { usePiece } from "../../hooks/use-piece.js";
import { useMemo, useState } from "react";

export function usePosition() {
  const [position, setPosition] = useState<PositionUnion | null>(null);
  const focusPiece = usePiece(position, setPosition);

  const focusValue = useMemo(() => {
    if (position?.kind === "cell") {
      return { row: position.rowIndex, column: position.colIndex };
    }
    return null;
  }, [position]);

  return { focusPiece, focusValue, position };
}
