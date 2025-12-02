import type { SpanLayout } from "@1771technologies/lytenyte-shared";
import { createContext, useContext } from "react";
import type { Piece } from "../../hooks/use-piece";

export const boundsContext = createContext({} as Piece<SpanLayout>);
export const useBounds = () => useContext(boundsContext);
