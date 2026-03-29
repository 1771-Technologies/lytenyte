import { createContext, useContext, useMemo, type PropsWithChildren, type ReactNode } from "react";
import type { CellParams, CellRendererParams, Column, EditParams } from "../../../types/index.js";
import { useColumnsContext } from "./column-context.js";

interface ColumnSetting {
  readonly cellRenderer: (params: CellRendererParams<any>) => ReactNode;
  readonly editRenderer: null | ((params: EditParams) => ReactNode);
  readonly editable: Column["editable"];
  readonly type: string;
}

const context = createContext<Record<string, ColumnSetting>>({});

export function ColumnSettingProvider({
  base,
  children,
}: PropsWithChildren<{
  base: Omit<Partial<Column>, "id" | "pin" | "field" | "editSetter"> | undefined;
}>) {
  const columns = useColumnsContext().view.visibleColumns as Column[];

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

export const useColumnSettingsContext = () => useContext(context);

function CellDefault({ column, row, api }: CellParams<any>) {
  if (row.data == null && row.loading) return <div>Loading...</div>;
  const field = api.columnField(column, row);
  return <div>{`${field ?? "-"}`}</div>;
}
