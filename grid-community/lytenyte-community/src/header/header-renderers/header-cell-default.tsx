import { t } from "@1771technologies/grid-design";
import type { ColumnHeaderRendererParamsReact } from "@1771technologies/grid-types/community-react";

export function HeaderCellDefault(p: ColumnHeaderRendererParamsReact<any>) {
  const label = p.column.headerName ?? p.column.id;
  return (
    <div
      className={css`
        display: flex;
        align-items: center;
        box-sizing: border-box;
        padding-inline: ${t.spacing.cell_horizontal_padding};
        width: 100%;
        height: 100%;

        color: ${t.colors.text_x_light};
        font-size: ${t.typography.body_m};
        font-family: ${t.typography.typeface_body};
        font-weight: 500;
        line-height: 20px;
        background-color: ${t.colors.backgrounds_ui_panel};
      `}
    >
      {label}
    </div>
  );
}
