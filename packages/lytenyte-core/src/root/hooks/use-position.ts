import type { PositionUnion } from "@1771technologies/lytenyte-shared";
import { usePiece } from "../../hooks/use-piece.js";
import { useState } from "react";

export function usePosition() {
  const [position, setPosition] = useState<PositionUnion | null>(null);

  const focusPiece = usePiece(position, setPosition);

  return { focusPiece, position };
}
