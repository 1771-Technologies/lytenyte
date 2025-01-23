import { t } from "@1771technologies/grid-design";
import type { CellRendererParamsReact } from "@1771technologies/grid-types/community-react";

export const cellCls = css`
  display: flex;
  align-items: center;
  padding-inline-start: ${t.spacing.cell_horizontal_padding};
  font-family: ${t.typography.typeface_body};
  font-size: ${t.typography.body_m};
  color: ${t.colors.text_medium};
  line-height: 20px;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
`;

export function CellRendererDefault(p: CellRendererParamsReact<any>) {
  const field = p.api.columnField(p.row, p.column);
  return (
    <div className={cellCls}>
      <div
        className={css`
          width: calc(100% - ${t.spacing.cell_horizontal_padding} / 2);
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        `}
      >
        {String(field ?? "")}
      </div>
    </div>
  );
}
