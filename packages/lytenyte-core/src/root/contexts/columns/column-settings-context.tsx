import { createContext, useContext, useMemo, type PropsWithChildren, type ReactNode } from "react";
import type {
  CellParams,
  CellRendererParams,
  Column,
  EditParams,
  HeaderParams,
} from "../../../types/index.js";
import { useColumnsContext } from "./column-context.js";
import { COLUMN_MARKER_ID, GROUP_COLUMN_PREFIX } from "@1771technologies/lytenyte-shared";

interface ColumnSetting {
  readonly cellRenderer: (params: CellRendererParams<any>) => ReactNode;
  readonly editRenderer: null | ((params: EditParams) => ReactNode);
  readonly editable: Column["editable"];
  readonly headerRenderer: (params: HeaderParams) => ReactNode;
  readonly floatingCellRenderer: (params: HeaderParams) => ReactNode;
  readonly movable: boolean;
  readonly resizable: boolean;
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
          resizable: x.id !== COLUMN_MARKER_ID && (x.resizable ?? base?.resizable ?? false),
          movable:
            (x.movable ?? base?.movable ?? false) &&
            x.id !== COLUMN_MARKER_ID &&
            !x.id.startsWith(GROUP_COLUMN_PREFIX),
          headerRenderer: x.headerRenderer ?? base?.headerRenderer ?? DefaultRenderer,
          floatingCellRenderer: x.floatingCellRenderer ?? base?.floatingCellRenderer ?? DefaultRenderer,
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

function DefaultRenderer(p: HeaderParams<any>) {
  return <>{p.column.name ?? p.column.id}</>;
}
