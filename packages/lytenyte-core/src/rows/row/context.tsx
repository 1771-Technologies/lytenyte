import { createContext, useContext } from "react";

export interface RowMetaData {
  readonly selected: boolean;
  readonly indeterminate: boolean;
}

export const RowContext = createContext<RowMetaData>({ selected: false, indeterminate: false });

export const useRowMeta = () => useContext(RowContext);
