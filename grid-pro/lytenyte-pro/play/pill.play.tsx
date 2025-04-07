import { Pill } from "../src/pill/pill";

export default function Pills() {
  return (
    <div
      className={css`
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 4px;
      `}
    >
      <Pill interactive kind="plain">
        This is a plain pill
      </Pill>
      <Pill interactive kind="column-pivot">
        This is a pivot pill
      </Pill>
      <Pill interactive kind="row-group">
        This is an aggregation pill
      </Pill>
      <Pill interactive kind="column">
        This is an column pill
      </Pill>
      <Pill interactive kind="custom">
        This is an custom pill
      </Pill>
    </div>
  );
}
