import { IconButton } from "../buttons/icon-button";
import type { SortAddComponentProps } from "./sort-manager";

export const DefaultDelete = () => {
  return <IconButton kind="ghost">⛌</IconButton>;
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
