import { createContext } from "react";
import type { Grid } from "../+types";
import type { InternalAtoms } from "../state/+types";

export const gridContext = createContext<Grid<any> & { internal: InternalAtoms }>(null as any);
