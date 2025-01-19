import { t } from "@1771technologies/grid-design";
import type { ApiCommunityReact, ColumnCommunityReact } from "@1771technologies/grid-types";
import type { ColumnPin } from "@1771technologies/grid-types/community";
import { clsx } from "@1771technologies/js-utils";

interface HeaderDividerProps {
  x: number;
  rowStart: number;
  rowEnd: number;
  pin: ColumnPin;
  column: ColumnCommunityReact<any>;
  api: ApiCommunityReact<any>;
  columnIndex: number;
}

export function HeaderDivider({ api, x, rowStart, rowEnd, column }: HeaderDividerProps) {
  const isResizable = api.columnIsResizable(column);

  return (
    <div
      className={clsx(
        css`
          grid-column-start: 1;
          grid-column-end: 2;

          box-sizing: border-box;

          width: 4px;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        `,
        isResizable &&
          css`
            cursor: col-resize;
          `,
      )}
      style={{
        gridRowStart: rowStart,
        gridRowEnd: rowEnd,
        transform: `translate3d(${x}px, 0px, 0px)`,
      }}
    >
      <div
        className={css`
          height: calc(100% - 8px);
          width: 2px;
          background-color: ${t.colors.borders_default};
        `}
      />
    </div>
  );
}
