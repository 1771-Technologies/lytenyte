import type { ColumnHeaderRendererParamsReact } from "@1771technologies/grid-types/enterprise-react";
import { HeaderLabel } from "./header-cell/header-label";

export function HeaderCellDefault({ column, api }: ColumnHeaderRendererParamsReact<any>) {
  const sx = api.getState();
  const base = sx.columnBase.use();

  const menuTrigger =
    column.columnMenuShowTriggerInHeader ?? base.columnMenuShowTriggerInHeader ?? false;
  const filterTrigger = column.filterShowTriggerInHeader ?? base.filterShowTriggerInHeader ?? false;

  const sortable = api.columnIsSortable(column);

  let endOffset = 0;
  if (menuTrigger) endOffset++;
  if (filterTrigger) endOffset++;

  void sortable;
  void endOffset;
  return (
    <div
      className={css`
        width: 100%;
        height: 100%;
      `}
    >
      <HeaderLabel api={api} column={column} />
    </div>
  );
}
