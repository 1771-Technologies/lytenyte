import { createContext, useContext } from "react";
import type { Column } from "../+types";
import type { PathBranch } from "@1771technologies/lytenyte-shared";

export const branchLookupContext = createContext<Record<string, PathBranch<Column<any>>>>({});

export const useBranchLookup = () => useContext(branchLookupContext);
