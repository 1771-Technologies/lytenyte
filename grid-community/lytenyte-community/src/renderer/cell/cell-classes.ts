import { t } from "@1771technologies/grid-design";

export const cellBaseClsx = css`
  grid-row-start: 1;
  grid-row-end: 2;
  grid-column-start: 1;
  grid-column-end: 2;
  box-sizing: border-box;

  border-bottom: 1px solid ${t.cellDividerX};
  border-right: 1px solid ${t.cellDividerY};
  padding-inline: ${t.cellPx};
  padding-block: ${t.cellPy};

  font-size: ${t.cellFontSize};
  font-weight: ${t.cellFontWeight};
  font-family: ${t.cellFontTypeface};

  user-select: none;
  overflow: hidden;
`;

export const cellCls = css`
  background-color: ${t.rowBg};
`;
export const cellClsAlt = css`
  background-color: ${t.rowBgAlt};
`;

export const cellSelected = css`
  background-color: ${t.rowBgSelected};
`;
