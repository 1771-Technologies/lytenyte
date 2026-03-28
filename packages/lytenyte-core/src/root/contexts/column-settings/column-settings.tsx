import { createContext, useContext, useMemo, type PropsWithChildren, type ReactNode } from "react";
import type { CellRendererParams, Column, EditParams } from "../../../types";
import { CellDefault } from "./cell-default.js";

interface ColumnSetting {
  readonly cellRenderer: (params: CellRendererParams<any>) => ReactNode;
  readonly editRenderer: null | ((params: EditParams) => ReactNode);
  readonly editable: Column["editable"];
  readonly type: string;
}

const context = createContext<Record<string, ColumnSetting>>({});

export function ColumnSettingProvider({
  columns,
  base,
  children,
}: PropsWithChildren<{
  columns: Column[];
  base: Omit<Partial<Column>, "id" | "pin" | "field" | "editSetter"> | undefined;
}>) {
  const settings = useMemo<Record<string, ColumnSetting>>(() => {
    const settings = columns.map((x) => {
      return [
        x.id,
        {
          cellRenderer: x.cellRenderer ?? base?.cellRenderer ?? CellDefault,
          editRenderer: x.editRenderer ?? base?.editRenderer ?? null,
          editable: x.editable ?? base?.editable ?? false,
          type: x.type ?? base?.type ?? "string",
        } satisfies ColumnSetting,
      ];
    });

    return Object.fromEntries(settings);
  }, [base, columns]);

  return <context.Provider value={settings}>{children}</context.Provider>;
}

export const useColumnSettings = () => useContext(context);
