import { IconButton } from "../buttons/icon-button";
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
