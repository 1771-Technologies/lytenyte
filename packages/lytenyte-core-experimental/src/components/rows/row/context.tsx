import type { LayoutRowWithCells, RowNode } from "@1771technologies/lytenyte-shared";
import { createContext, useContext } from "react";
import type { EditContext } from "../../../root/root-context";

export interface RowMeta {
  readonly row:
    | (RowNode<any> & {
        __selected: boolean;
        __indeterminate: boolean;
        __localSnapshot: number;
        __globalSnapshot: number;
      })
    | null;
  readonly layout: LayoutRowWithCells<any>;
  readonly xPositions: Uint32Array;
  readonly yPositions: Uint32Array;

  readonly isEditing: boolean;
  readonly editData: any;
  readonly editColumn: string | null | undefined;
  readonly commit: EditContext["commit"];
  readonly cancel: EditContext["cancel"];
  readonly changeValue: EditContext["changeValue"];
  readonly changeData: EditContext["changeData"];
}

export const RowContext = createContext<RowMeta>({} as any);

export const useRowMeta = () => useContext(RowContext);
