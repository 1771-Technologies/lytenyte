import { useState, type PropsWithChildren } from "react";
import { focusPositionContext } from "./focus-position-context.js";
import type { PositionUnion } from "../../types/position";
import { usePiece } from "../../hooks/use-piece.js";

export function FocusPositionProvider(props: PropsWithChildren) {
  const [position, setPosition] = useState<PositionUnion | null>(null);

  const value = usePiece(position, setPosition);

  return (
    <focusPositionContext.Provider value={value}>{props.children}</focusPositionContext.Provider>
  );
}
