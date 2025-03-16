import { t } from "@1771technologies/grid-design";

export const dragCls = css`
  position: relative;
  &::before {
    content: "";
    position: absolute;
    top: 0;
    inset-inline-start: 0;
    width: 100%;
    height: 1px;
    background-color: ${t.colors.primary_50};
  }
`;
export const dragClsFirst = css`
  &::before {
    top: ${t.spacing.space_05};
  }
`;
