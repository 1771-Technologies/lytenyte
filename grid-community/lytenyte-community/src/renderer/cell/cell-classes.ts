import { t } from "@1771technologies/grid-design";

export const rowBaseClx = css`
  grid-row-start: 1;
  grid-row-end: 2;
  grid-column-start: 1;
  grid-column-end: 2;
  box-sizing: border-box;
  border-bottom: 1px solid ${t.colors.borders_row};
  user-select: none;
  overflow: hidden;
`;

export const rowClx = css`
  background-color: ${t.colors.backgrounds_row};
`;
export const rowAltClx = css`
  background-color: ${t.colors.backgrounds_row_alternate};
`;

export const cellSelected = css`
  background-color: ${t.colors.backgrounds_row_selected};
`;
