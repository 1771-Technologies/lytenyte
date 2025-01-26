import type { MenuProps } from "@1771technologies/react-menu";
import { t } from "@1771technologies/grid-design";
import { CheckMark } from "@1771technologies/lytenyte-grid-community/internal";

export const DefaultCheckbox: MenuProps["rendererCheckbox"] = (props) => {
  return (
    <div
      className={css`
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
      `}
    >
      <span>{props.label}</span>
      {props.checked && (
        <span
          className={css`
            color: ${t.colors.primary_50};
          `}
        >
          <CheckMark />
        </span>
      )}
    </div>
  );
};
