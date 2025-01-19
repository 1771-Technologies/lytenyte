import { t } from "@1771technologies/grid-design";
import type { ApiCommunityReact } from "@1771technologies/grid-types";
import type { ColumnGroupRowItem } from "@1771technologies/grid-types/community";
import { useMemo } from "react";

export interface HeaderGroupRendererProps {
  readonly group: ColumnGroupRowItem;
  readonly api: ApiCommunityReact<any>;
}

export function HeaderGroupDefault({ group, api }: HeaderGroupRendererProps) {
  const label = useMemo(() => {
    const delimiter = api.getState().columnGroupIdDelimiter.peek();
    return group.id.split(delimiter).at(-1)!;
  }, [api, group.id]);

  return (
    <div
      className={css`
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        padding-inline: ${t.spacing.cell_horizontal_padding};

        color: ${t.colors.text_medium};
        font-size: ${t.typography.body_m};
        font-family: ${t.typography.typeface_body};
        font-weight: 600;
        background-color: ${t.colors.backgrounds_ui_panel};
      `}
    >
      {label}
    </div>
  );
}
