import type { ColumnCommunityReact } from "@1771technologies/grid-types";

interface HeaderCellProps {
  readonly column: ColumnCommunityReact<any>;
  readonly rowStart: number;
  readonly rowEnd: number;
}

export function HeaderCell({ column, rowStart, rowEnd }: HeaderCellProps) {
  return (
    <div
      style={{ gridRowStart: rowStart, gridRowEnd: rowEnd }}
      className={css`
        grid-column-start: 1;
        grid-column-end: 2;
      `}
    >
      {column.headerName ?? column.id}
    </div>
  );
}
