import { clsx } from "@1771technologies/js-utils";
import { IconButton } from "../buttons/icon-button";
import { cc } from "../component-configuration";
import type { SortAddComponentProps, SortDeleteComponentProps } from "./sort-manager";

export const DefaultDelete = (props: SortDeleteComponentProps) => {
  return (
    <IconButton
      kind="ghost"
      onClick={props.onDelete}
      disabled={props.disabled}
      disabledReason={props.disableReason}
    >
      ⛌
    </IconButton>
  );
};

export const DefaultAdd = (props: SortAddComponentProps) => {
  return (
    <IconButton
      kind="ghost"
      onClick={props.onAdd}
      disabled={props.disabled}
      disabledReason={props.disableReason}
    >
      <span
        className={css`
          font-size: 20px;
        `}
      >
        +
      </span>
    </IconButton>
  );
};

export const DefaultEmpty = () => {
  const config = cc.sortManager.use();

  const label = config.localization!.labelEmptyColumnSet;

  return (
    <div
      className={clsx(
        "lng1771-text-medium",
        css`
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
        `,
      )}
    >
      {label}
    </div>
  );
};
