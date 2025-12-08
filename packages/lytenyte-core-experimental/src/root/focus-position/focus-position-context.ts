import { createContext, useContext } from "react";
import type { PieceWritable } from "../../hooks/use-piece";
import type { PositionUnion } from "../../types/position";

export const focusPositionContext = createContext<PieceWritable<PositionUnion | null>>(null as any);
export const useFocusPosition = () => useContext(focusPositionContext);
