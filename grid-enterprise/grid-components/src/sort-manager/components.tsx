import { IconButton } from "../buttons/icon-button";

export const DefaultDelete = () => {
  return <IconButton kind="ghost">⛌</IconButton>;
};

export const DefaultAdd = () => {
  return (
    <IconButton kind="ghost">
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
