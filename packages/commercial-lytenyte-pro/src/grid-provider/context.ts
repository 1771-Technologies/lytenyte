import { createContext } from "react";
import type { Grid } from "../+types.js";
import type { InternalAtoms } from "../state/+types.js";

export const gridContext = createContext<Grid<any> & { internal: InternalAtoms }>(null as any);
